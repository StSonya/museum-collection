let currentItem = null;

function showDetail(id) {
  currentItem = window.collection.find(item => item.id === id);
  if (!currentItem) return;

  let modalHTML = `
    <div class="modal fade" id="detailModal" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${currentItem.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs mb-3">
              <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#tab-desc">Опис</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-photo">Фото</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-light">Світло</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-volume">Об’єм</a></li>
            </ul>
            <div class="tab-content">
              <!-- Опис -->
              <div class="tab-pane fade show active" id="tab-desc">
                <p><strong>Інвентарний номер:</strong> ${currentItem.inventory}</p>
                <p><strong>Матеріал:</strong> ${currentItem.material}</p>
                <p><strong>Техніка:</strong> ${currentItem.technique || '—'}</p>
                <p><strong>Дата:</strong> ${currentItem.date}</p>
                <p><strong>Розміри:</strong> ${currentItem.dimensions}</p>
                <p><strong>Походження:</strong> ${currentItem.origin}</p>
                <hr>
                <p>${currentItem.description}</p>
              </div>
              <!-- Фото -->
              <div class="tab-pane fade" id="tab-photo">
                <img src="assets/${currentItem.photos[0]}" class="img-fluid rounded" alt="${currentItem.title}">
              </div>
              <!-- Світло (нормалі) -->
              <div class="tab-pane fade" id="tab-light">
                <canvas id="normalCanvas" width="900" height="520" style="width:100%; background:#111;"></canvas>
              </div>
              <!-- Об’єм -->
              <div class="tab-pane fade" id="tab-volume">
                ${currentItem.model ? 
                  `<model-viewer src="assets/${currentItem.model}" style="width:100%; height:520px;" camera-controls auto-rotate shadow-intensity="1"></model-viewer>` : 
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

  // Видаляємо старий модал, якщо є
  const oldModal = document.getElementById('detailModal');
  if (oldModal) oldModal.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  new bootstrap.Modal(document.getElementById('detailModal')).show();

  // Ініціалізація нормалей при відкритті вкладки "Світло"
  document.querySelector('a[href="#tab-light"]').addEventListener('shown.bs.tab', () => {
    initNormalMap(currentItem);
  }, { once: true });
}

function initNormalMap(item) {
  const canvas = document.getElementById('normalCanvas');
  if (!canvas || !item.normalMap) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const loader = new THREE.TextureLoader();
  loader.load(`assets/${item.normalMap}`, texture => {
    const material = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      normalMap: texture,
      normalScale: new THREE.Vector2(2.8, 2.8)
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), material);
    scene.add(mesh);

    const light = new THREE.PointLight(0xffffff, 4);
    light.position.set(5, 5, 12);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xaaaaaa, 0.7));

    camera.position.z = 13;

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.0006;
      renderer.render(scene, camera);
    }
    animate();

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      light.position.x = ((e.clientX - rect.left) / rect.width) * 20 - 10;
      light.position.y = -((e.clientY - rect.top) / rect.height) * 18 + 9;
    });
  });
}

window.showDetail = showDetail;let currentItem = null;

function showDetail(id) {
  currentItem = window.collection.find(item => item.id === id);
  if (!currentItem) return;

  let modalHTML = `
    <div class="modal fade" id="detailModal" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${currentItem.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs mb-3">
              <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#tab-desc">Опис</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-photo">Фото</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-light">Світло</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-volume">Об’єм</a></li>
            </ul>
            <div class="tab-content">
              <!-- Опис -->
              <div class="tab-pane fade show active" id="tab-desc">
                <p><strong>Інвентарний номер:</strong> ${currentItem.inventory}</p>
                <p><strong>Матеріал:</strong> ${currentItem.material}</p>
                <p><strong>Техніка:</strong> ${currentItem.technique || '—'}</p>
                <p><strong>Дата:</strong> ${currentItem.date}</p>
                <p><strong>Розміри:</strong> ${currentItem.dimensions}</p>
                <p><strong>Походження:</strong> ${currentItem.origin}</p>
                <hr>
                <p>${currentItem.description}</p>
              </div>
              <!-- Фото -->
              <div class="tab-pane fade" id="tab-photo">
                <img src="assets/${currentItem.photos[0]}" class="img-fluid rounded" alt="${currentItem.title}">
              </div>
              <!-- Світло (нормалі) -->
              <div class="tab-pane fade" id="tab-light">
                <canvas id="normalCanvas" width="900" height="520" style="width:100%; background:#111;"></canvas>
              </div>
              <!-- Об’єм -->
              <div class="tab-pane fade" id="tab-volume">
                ${currentItem.model ? 
                  `<model-viewer src="assets/${currentItem.model}" style="width:100%; height:520px;" camera-controls auto-rotate shadow-intensity="1"></model-viewer>` : 
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

  const old = document.getElementById('detailModal');
  if (old) old.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  new bootstrap.Modal(document.getElementById('detailModal')).show();

  // Ініціалізація нормалей при відкритті вкладки "Світло"
  document.querySelector('a[href="#tab-light"]').addEventListener('shown.bs.tab', () => {
    initNormalMap(currentItem);
  }, { once: true });
}

function initNormalMap(item) {
  const canvas = document.getElementById('normalCanvas');
  if (!canvas || !item.normalMap) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const loader = new THREE.TextureLoader();
  loader.load(`assets/${item.normalMap}`, texture => {
    const material = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      normalMap: texture,
      normalScale: new THREE.Vector2(2.8, 2.8)
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), material);
    scene.add(mesh);

    const light = new THREE.PointLight(0xffffff, 4);
    light.position.set(5, 5, 12);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xaaaaaa, 0.7));

    camera.position.z = 13;

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.0006;
      renderer.render(scene, camera);
    }
    animate();

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      light.position.x = ((e.clientX - rect.left) / rect.width) * 20 - 10;
      light.position.y = -((e.clientY - rect.top) / rect.height) * 18 + 9;
    });
  });
}

window.showDetail = showDetail;
