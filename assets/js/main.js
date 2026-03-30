// assets/js/main.js

let currentItem = null;
let normalRenderer, normalScene, normalCamera, normalLight, normalMesh;

function showDetail(id) {
  currentItem = window.collection.find(item => item.id === id);
  if (!currentItem) return;

  let modalHTML = `
    <div class="modal fade" id="detailModal" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${currentItem.title} <small class="text-muted">(${currentItem.inventory})</small></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs mb-3" id="viewTabs">
              <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#tab-1d">1D — Опис</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-2d">2D — Фото</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-25d">2.5D — Нормалі</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-3d">3D — Модель</a></li>
            </ul>
            <div class="tab-content">
              <!-- 1D Опис -->
              <div class="tab-pane fade show active" id="tab-1d">
                <h6>Інформація про експонат</h6>
                <p><strong>Матеріал:</strong> ${currentItem.material || '—'}</p>
                <p><strong>Дата:</strong> ${currentItem.date || '—'}</p>
                <p><strong>Розміри:</strong> ${currentItem.dimensions || '—'}</p>
                <p><strong>Походження:</strong> ${currentItem.origin || '—'}</p>
                <hr>
                <p>${currentItem.description || 'Опис відсутній'}</p>
              </div>
              <!-- 2D Фото -->
              <div class="tab-pane fade" id="tab-2d">
                <div id="photoCarousel" class="carousel slide"></div>
              </div>
              <!-- 2.5D Нормалі -->
              <div class="tab-pane fade" id="tab-25d">
                <canvas id="normalCanvas" width="900" height="520" style="width:100%; max-height:520px; background:#111; display:block;"></canvas>
              </div>
              <!-- 3D Модель -->
              <div class="tab-pane fade" id="tab-3d">
                ${currentItem.model ? 
                  `<model-viewer id="modelViewer" src="assets/${currentItem.model}" style="width:100%; height:520px;" camera-controls auto-rotate shadow-intensity="1"></model-viewer>` : 
                  (currentItem.sketchfabUrl ? 
                    `<iframe src="${currentItem.sketchfabUrl}/embed" style="width:100%; height:520px; border:none;" allowfullscreen></iframe>` : 
                    '<p class="text-muted">3D-модель відсутня</p>')
                }
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрити</button>
          </div>
        </div>
      </div>
    </div>`;

  // Видаляємо старий модал якщо є
  const oldModal = document.getElementById('detailModal');
  if (oldModal) oldModal.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById('detailModal'));
  modal.show();

  // Ініціалізація каруселі фото
  setTimeout(() => {
    let html = `<div class="carousel-inner">`;
    currentItem.photos.forEach((photo, i) => {
      html += `<div class="carousel-item ${i === 0 ? 'active' : ''}">
                 <img src="assets/${photo}" class="d-block w-100" style="max-height:520px; object-fit:contain;">
               </div>`;
    });
    html += `</div>`;
    if (currentItem.photos.length > 1) {
      html += `
        <button class="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
        <button class="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>`;
    }
    document.getElementById('photoCarousel').innerHTML = html;
  }, 300);

  // Ініціалізація нормалей при відкритті вкладки
  const tabs = document.getElementById('viewTabs');
  tabs.addEventListener('shown.bs.tab', function handler(e) {
    if (e.target.getAttribute('href') === '#tab-25d') {
      initNormalMap(currentItem);
      tabs.removeEventListener('shown.bs.tab', handler);
    }
  });
}

function initNormalMap(item) {
  const canvas = document.getElementById('normalCanvas');
  if (!canvas || !item.normalMap) return;

  if (normalRenderer) normalRenderer.dispose();

  normalScene = new THREE.Scene();
  normalCamera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  normalRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  normalRenderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const loader = new THREE.TextureLoader();
  loader.load(`assets/${item.normalMap}`, (texture) => {
    const material = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      normalMap: texture,
      normalScale: new THREE.Vector2(2.8, 2.8)
    });
    normalMesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), material);
    normalScene.add(normalMesh);

    normalLight = new THREE.PointLight(0xffffff, 4);
    normalLight.position.set(5, 5, 12);
    normalScene.add(normalLight);
    normalScene.add(new THREE.AmbientLight(0xaaaaaa, 0.7));

    normalCamera.position.z = 13;
    animateNormal();
  });

  function animateNormal() {
    requestAnimationFrame(animateNormal);
    if (normalMesh) normalMesh.rotation.y += 0.0006;
    if (normalRenderer) normalRenderer.render(normalScene, normalCamera);
  }

  // Керування світлом мишкою
  canvas.addEventListener('mousemove', (e) => {
    if (!normalLight) return;
    const rect = canvas.getBoundingClientRect();
    normalLight.position.x = ((e.clientX - rect.left) / rect.width) * 20 - 10;
    normalLight.position.y = -((e.clientY - rect.top) / rect.height) * 18 + 9;
  });
}

// Робимо функцію доступною глобально
window.showDetail = showDetail;
