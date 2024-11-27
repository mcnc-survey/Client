import Swal from "sweetalert2";
import "@/assets/css/CustomAlert.css";

// 성공 알림 표시 함수
export const showSuccessAlert = (
  title,
  message = null,
  buttonColor = "#FCE391"
) => {
  Swal.fire({
    html: `
        <div class="custom-alert-content">
          <p>${title}</p>
          ${message ? `<small>${message}</small>` : ""}
        </div>
      `,
    showConfirmButton: true,
    confirmButtonText: "확인",
    customClass: {
      popup: "custom-swal-popup",
      confirmButton: "custom-confirm-button",
      content: "custom-alert-content",
    },
    buttonsStyling: false,
    didOpen: () => {
      const confirmButton = Swal.getConfirmButton();
      if (confirmButton) {
        confirmButton.style.backgroundColor = buttonColor;
        confirmButton.style.margin = "0 0 35px 0";
      }
    },
  });
};

// 에러 알림 표시 함수
export const showErrorAlert = (title, message = null) => {
  Swal.fire({
    html: `
      <div class="custom-alert-content">
        <p>${title}</p>
        ${message ? `<small>${message}</small>` : ""}
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "확인",
    customClass: {
      popup: "custom-swal-popup",
      confirmButton: "custom-confirm-button",
      content: "custom-alert-content",
    },
    buttonsStyling: false,
  });
};

// 확인/취소 알림 표시 함수
export const showConfirmAlert = (options) => {
  const defaultOptions = {
    title: "알림",
    html: null,
    confirmText: "삭제",
    cancelText: "취소",
    subMessage: "* 삭제 후에는 복구할 수 없습니다.",
    onConfirm: () => {},
  };

  const mergedOptions = { ...defaultOptions, ...options };

  Swal.fire({
    html: `
      <div class="custom-alert-content">
        <p>${mergedOptions.html || mergedOptions.title}</p>
        ${
          mergedOptions.subMessage
            ? `<small>${mergedOptions.subMessage}</small>`
            : ""
        }
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: mergedOptions.confirmText,
    cancelButtonText: mergedOptions.cancelText,
    customClass: {
      popup: "custom-swal-popup",
      confirmButton: "custom-confirm-button",
      cancelButton: "custom-cancel-button",
      content: "custom-alert-content",
    },
    buttonsStyling: false,
  }).then((result) => {
    if (result.isConfirmed) {
      mergedOptions.onConfirm();
    }
  });
};
