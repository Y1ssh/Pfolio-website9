// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// Three.js 3D Model Setup
const canvas = document.getElementById('spaceship-canvas');
let scene, camera, renderer, spaceship;

// Initialize Three.js scene
function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    
    // Camera setup
    const aspect = canvas.clientWidth / canvas.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lighting setup
    setupLighting();
    
    // Load 3D model
    loadSpaceshipModel();
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Setup lighting for the 3D scene
function setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Additional point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x0066cc, 0.8, 10);
    pointLight1.position.set(-3, 2, 2);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff6b6b, 0.8, 10);
    pointLight2.position.set(3, -2, 2);
    scene.add(pointLight2);
}

// Load the GLB spaceship model
function loadSpaceshipModel() {
    const loader = new THREE.GLTFLoader();
    
    // Show loading indicator
    showLoadingIndicator();
    
    loader.load(
        'assets/models/interstellar_endurance.glb',
        function(gltf) {
            spaceship = gltf.scene;
            
            // Scale and position the model
            spaceship.scale.set(0.8, 0.8, 0.8);
            spaceship.position.set(0, 0, 0);
            spaceship.rotation.x = 0.2;
            spaceship.rotation.y = 0.3;
            
            // Enable shadows for all meshes
            spaceship.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Enhance materials
                    if (child.material) {
                        child.material.metalness = 0.8;
                        child.material.roughness = 0.2;
                    }
                }
            });
            
            scene.add(spaceship);
            hideLoadingIndicator();
            console.log('✅ Spaceship model loaded successfully!');
        },
        function(progress) {
            const percent = (progress.loaded / progress.total * 100).toFixed(0);
            updateLoadingProgress(percent);
            console.log('Loading progress:', percent + '%');
        },
        function(error) {
            console.error('❌ Model loading error:', error);
            hideLoadingIndicator();
            showModelError();
        }
    );
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate spaceship slowly
    if (spaceship) {
        spaceship.rotation.y += 0.01;
        
        // Add floating animation
        spaceship.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

// Loading indicator functions
function showLoadingIndicator() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: white;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">🚀</div>
            <div>Loading Spaceship...</div>
            <div id="loading-progress" style="margin-top: 0.5rem;">0%</div>
        </div>
    `;
    overlay.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10;';
    canvas.parentElement.appendChild(overlay);
}

function updateLoadingProgress(percent) {
    const progressEl = document.getElementById('loading-progress');
    if (progressEl) {
        progressEl.textContent = percent + '%';
    }
}

function hideLoadingIndicator() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function showModelError() {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: white;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
            <div>Unable to load 3D model</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7;">Check console for details</div>
        </div>
    `;
    overlay.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10;';
    canvas.parentElement.appendChild(overlay);
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Message sent successfully! (Demo only)');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
        
        console.log('Contact form submitted:', { email, message });
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio initialized!');
    
    // Initialize Three.js
    if (canvas) {
        initThreeJS();
    }
    
    // Add some interactive elements
    addMouseInteraction();
});

// Add mouse interaction to the 3D model
function addMouseInteraction() {
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;
    
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        targetRotationX = mouseY * 0.3;
        targetRotationY = mouseX * 0.3;
    });
    
    // Apply mouse movement to spaceship rotation
    function updateMouseInteraction() {
        if (spaceship) {
            spaceship.rotation.x += (targetRotationX - spaceship.rotation.x) * 0.05;
            spaceship.rotation.y += (targetRotationY - spaceship.rotation.y) * 0.05;
        }
    }
    
    // Add to animation loop
    const originalAnimate = animate;
    animate = function() {
        requestAnimationFrame(animate);
        
        if (spaceship) {
            spaceship.rotation.y += 0.01;
            spaceship.position.y = Math.sin(Date.now() * 0.001) * 0.2;
            updateMouseInteraction();
        }
        
        renderer.render(scene, camera);
    };
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    
    if (event.error && event.error.message.includes('GLTFLoader')) {
        showModelError();
    }
});

console.log('🎯 Portfolio JavaScript loaded successfully!'); 