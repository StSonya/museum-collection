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
}

window.showDetail = showDetail;
