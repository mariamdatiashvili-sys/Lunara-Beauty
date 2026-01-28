/**
 * services.js
 * Handles fetching services from API, Rendering, and Admin CRUD operations
 */

document.addEventListener('DOMContentLoaded', () => {
    initServices();
});

let allServices = [];

async function initServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    // 1. Inject UI Components (Search, Add Button, Modal)
    injectControls();

    // 2. Load Data
    await loadServices();
}

/* ===========================
   UI & Rendering
   =========================== */

function injectControls() {
    const servicesSection = document.querySelector('.services-section');
    const grid = document.getElementById('servicesGrid');

    if (document.getElementById('servicesControls')) return;

    // Create a container for ALL controls
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'servicesControls';
    controlsContainer.className = 'container';
    controlsContainer.style.marginBottom = '30px';
    controlsContainer.style.textAlign = 'center';

    // 1. Search Bar & Filters Wrapper
    const filterWrapper = document.createElement('div');
    filterWrapper.className = 'filter-wrapper';
    filterWrapper.style.marginBottom = '20px';
    filterWrapper.style.display = 'flex';
    filterWrapper.style.justifyContent = 'center';
    filterWrapper.style.flexWrap = 'wrap';
    filterWrapper.style.gap = '10px';

    filterWrapper.innerHTML = `
        <input type="text" id="searchInput" class="filter-input search-input-wide" placeholder="Search services...">
        
        <input type="number" id="minPrice" class="filter-input price-input" placeholder="Min Price">
            
        <input type="number" id="maxPrice" class="filter-input price-input" placeholder="Max Price">
    `;
    controlsContainer.appendChild(filterWrapper);

    // 2. Admin Button
    const user = getCurrentUser();
    if (isAdmin(user)) {
        const adminBtnWrapper = document.createElement('div');
        adminBtnWrapper.innerHTML = `
            <button id="addServiceBtn" class="btn-add-service"><i class="fas fa-plus"></i> Add New Service</button>
        `;
        controlsContainer.appendChild(adminBtnWrapper);
    }

    servicesSection.insertBefore(controlsContainer, grid);

    // Unified Filter Logic
    const searchInput = document.getElementById('searchInput');
    const minInput = document.getElementById('minPrice');
    const maxInput = document.getElementById('maxPrice');

    function applyFilters() {
        const term = searchInput.value.toLowerCase();
        const min = parseFloat(minInput.value) || 0;
        const max = parseFloat(maxInput.value) || Infinity;

        const filtered = allServices.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(term) ||
                (s.description && s.description.toLowerCase().includes(term));

            // Clean price string roughly just in case, though API returns string usually
            const price = parseFloat(s.price);
            const matchesPrice = price >= min && price <= max;

            return matchesSearch && matchesPrice;
        });
        renderServices(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    minInput.addEventListener('input', applyFilters);
    maxInput.addEventListener('input', applyFilters);

    // Admin Add
    if (isAdmin(user)) {
        document.getElementById('addServiceBtn').addEventListener('click', () => openServiceModal());
    }

    injectServiceModal();
}

function injectServiceModal() {
    if (document.getElementById('serviceModal')) return;

    const modalHTML = `
    <div id="serviceModal" class="modal" style="display:none; position:fixed; z-index:2000; left:0; top:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5);">
        <div class="modal-content" style="background:#fff; margin:10% auto; padding:30px; width:90%; max-width:500px; border-radius:10px; position:relative;">
            <span class="close-crud" style="position:absolute; right:20px; top:15px; font-size:24px; cursor:pointer;">&times;</span>
            <h2 id="modalTitle" style="text-align:center; color:#682d3b; margin-bottom:20px;">Add Service</h2>
            <form id="serviceForm">
                <input type="hidden" id="sId">
                <div class="form-group">
                    <label>Service Name</label>
                    <input type="text" id="sName" required class="form-control" style="width:100%; padding:8px; margin-bottom:10px;">
                </div>
                <div class="form-group">
                    <label>Price (GEL)</label>
                    <input type="number" id="sPrice" required class="form-control" style="width:100%; padding:8px; margin-bottom:10px;">
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" id="sDuration" placeholder="e.g. 1 hr" required class="form-control" style="width:100%; padding:8px; margin-bottom:10px;">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="sDesc" rows="3" class="form-control" style="width:100%; padding:8px; margin-bottom:10px;"></textarea>
                </div>
                <!-- <div class="form-group">
                    <label>Image URL</label>
                    <input type="text" id="sImage" placeholder="http://..." class="form-control" style="width:100%; padding:8px; margin-bottom:10px;">
                </div> -->
                <button type="submit" class="btn btn-primary" style="width:100%;">Save</button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Modal Events
    const modal = document.getElementById('serviceModal');
    const closeBtn = modal.querySelector('.close-crud');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

    document.getElementById('serviceForm').onsubmit = handleFormSubmit;
}

async function loadServices() {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = '<p style="text-align:center; width:100%;">Loading services...</p>';

    try {
        const services = await api.get('products');
        allServices = services; // Store for valid rendering if needed
        renderServices(services);
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p style="text-align:center; color:red; width:100%;">Failed to load services.</p>';
    }
}

function renderServices(services) {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = '';

    if (!services || services.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%;">No services found.</p>';
        return;
    }

    const user = getCurrentUser();
    const adminMode = isAdmin(user);

    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-box fade-up';
        card.style.position = 'relative'; // Ensure absolute positioning works for icons

        // Admin Icons (Edit/Delete)
        let adminControls = '';
        let cartBtn = `<button class="btn-cart" onclick="addToCart('${service.name}', ${service.price})" style="margin-top: 10px;">Add to Cart</button>`;

        if (adminMode) {
            adminControls = `
            <div style="position:absolute; top:15px; right:15px; display:flex; gap:12px;">
                <i class="fas fa-edit" onclick="editService('${service.id}')" style="color:#c88b8b; cursor:pointer; font-size:18px;" title="Edit"></i>
                <i class="fas fa-times" onclick="deleteService('${service.id}')" style="color:#b75c83; cursor:pointer; font-size:20px;" title="Delete"></i>
            </div>
            `;
            // Hide Cart Button for Admin
            cartBtn = '';
        }

        card.innerHTML = `
            ${adminControls}
            <h3>${service.name}</h3>
            <p>${service.description || 'No description available.'}</p>
            <button class="price">${service.duration} • GEL ${service.price}</button>
            ${cartBtn}
        `;
        grid.appendChild(card);
    });
}

/* ===========================
   CRUD Logic
   =========================== */

function openServiceModal(id = null) {
    const modal = document.getElementById('serviceModal');
    const form = document.getElementById('serviceForm');
    const title = document.getElementById('modalTitle');

    if (id) {
        // Edit Mode
        const service = allServices.find(s => s.id === id);
        if (!service) return;

        title.innerText = 'Edit Service';
        document.getElementById('sId').value = service.id;
        document.getElementById('sName').value = service.name;
        document.getElementById('sPrice').value = service.price;
        document.getElementById('sDuration').value = service.duration;
        document.getElementById('sDesc').value = service.description || '';
        // document.getElementById('sImage').value = service.image || '';
    } else {
        // Create Mode
        title.innerText = 'Add New Service';
        form.reset();
        document.getElementById('sId').value = '';
    }

    modal.style.display = 'block';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('sId').value;
    const data = {
        name: document.getElementById('sName').value,
        price: document.getElementById('sPrice').value,
        duration: document.getElementById('sDuration').value,
        description: document.getElementById('sDesc').value,
        // image: document.getElementById('sImage').value
    };

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = 'Saving...';
    btn.disabled = true;

    try {
        if (id) {
            await api.put('products', id, data);
        } else {
            await api.post('products', data);
        }
        document.getElementById('serviceModal').style.display = 'none';
        loadServices();
    } catch (error) {
        alert('Operation failed.');
        console.log(error);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// Global functions for inline onclicks
window.editService = (id) => openServiceModal(id);

window.deleteService = async (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
        try {
            await api.delete('products', id);
            loadServices();
        } catch (error) {
            alert('Delete failed.');
        }
    }
};

/* ===========================
   Helpers
   =========================== */
function getCurrentUser() {
    // Helper to get from localstorage safely
    // Assuming auth.js saves to 'lunaraUser'
    const stored = localStorage.getItem('lunaraUser');
    return stored ? JSON.parse(stored) : null;
}

function isAdmin(user) {
    if (!user) return false;
    // Check Role OR Username OR Email (for manual admin)
    if (user.role && user.role.toLowerCase() === 'admin') return true;
    if (user.username && user.username.toLowerCase() === 'admin') return true;
    if (user.email && (user.email.toLowerCase() === 'admin@lunara.com' || user.email.includes('admin'))) return true;

    return false;
}
