import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  success(message: string, title: string = 'Éxito') {
    Swal.fire({ icon: 'success', title, text: message, confirmButtonColor: '#3085d6' });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({ icon: 'error', title, text: message, confirmButtonColor: '#d33' });
  }

  warning(message: string, title: string = 'Advertencia') {
    Swal.fire({ icon: 'warning', title, text: message, confirmButtonColor: '#fbc02d' });
  }

  confirm(title: string, text: string, onConfirm: () => void) {
    Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) onConfirm();
    });
  }
}