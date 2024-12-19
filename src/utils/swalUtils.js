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
  // 'DELETED' 메시지가 포함된 경우 오류로 처리하지 않음
  if (message && message.includes("DELETED")) {
    return;
  }

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
        confirmButton.style.margin = "0 0 35px 0";
      }
    },
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

// 확인 버튼 클릭시 페이지 이동하는 알림 표시 함수
export const showNavigateAlert = (options) => {
  const defaultOptions = {
    title: "알림",
    html: null,
    confirmText: "확인",
    subMessage: "",
    onConfirm: () => {},
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return Swal.fire({
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
    showConfirmButton: true,
    confirmButtonText: mergedOptions.confirmText,
    customClass: {
      popup: "custom-swal-popup",
      confirmButton: "custom-confirm-button",
      content: "custom-alert-content",
    },
    buttonsStyling: false,
    didOpen: () => {
      const confirmButton = Swal.getConfirmButton();
      if (confirmButton) {
        confirmButton.style.backgroundColor = "#FCE391"; // 버튼 배경색 (초록색 예시)
        confirmButton.style.margin = "0 0 35px 0";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      mergedOptions.onConfirm();
    }
  });
};

export const showEmailInviteDialog = async (options) => {
  const defaultOptions = {
    title: "설문 링크를 공유할 이메일을 입력해주세요",
    confirmText: "초대하기",
    cancelText: "취소",
    onConfirm: () => {},
  };

  const mergedOptions = { ...defaultOptions, ...options };
  let emails = new Set();

  const result = await Swal.fire({
    title: mergedOptions.title,
    html: `
      <div class="custom-alert-content">
        <div class="email-input-container">
          <input type="email" id="email-input" class="swal2-input" 
                 placeholder="이메일 주소를 입력하세요" style="margin: 0;">
          <button type="button" id="add-email-btn" 
                  class="custom-confirm-button" 
                  style="padding: 8px 16px; margin: 0;"> 추가 </button>
        </div>
        <div id="email-tags" class="email-tags"></div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: mergedOptions.confirmText,
    cancelButtonText: mergedOptions.cancelText,
    customClass: {
      title: "custom-email-title",
      popup: "custom-swal-popup",
      confirmButton: "custom-confirm-button",
      cancelButton: "custom-cancel-button",
      content: "custom-alert-content",
    },
    buttonsStyling: false,
    didOpen: () => {
      const emailInput = document.getElementById("email-input");
      const addButton = document.getElementById("add-email-btn");
      const emailTags = document.getElementById("email-tags");

      const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };

      const updateEmailTags = () => {
        emailTags.innerHTML = Array.from(emails)
          .map(
            (email) => `
          <div class="email-tag">
            ${email}
            <button type="button" class="remove-email" data-email="${email}">×</button>
          </div>
        `
          )
          .join("");

        document.querySelectorAll(".remove-email").forEach((button) => {
          button.addEventListener("click", (e) => {
            const emailToRemove = e.target.getAttribute("data-email");
            emails.delete(emailToRemove);
            updateEmailTags();
          });
        });
      };

      const addEmail = () => {
        const email = emailInput.value.trim();
        if (email && validateEmail(email)) {
          emails.add(email);
          emailInput.value = "";
          updateEmailTags();
        } else if (email) {
          Swal.showValidationMessage(
            '<div class="custom-validation-message">유효한 이메일 주소를 입력해주세요.</div>'
          );
        }
      };

      addButton.addEventListener("click", addEmail);

      emailInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addEmail();
        }
      });

      const confirmButton = Swal.getConfirmButton();
      if (confirmButton) {
        confirmButton.style.margin = "0 0 35px 0";
      }
    },
    preConfirm: () => {
      const emailList = Array.from(emails);
      if (emailList.length === 0) {
        Swal.showValidationMessage(
          '<div class="custom-validation-message">최소 한 개의 이메일을 입력해주세요.</div>'
        );
        return false;
      }
      return emailList;
    },
  });

  if (result.isConfirmed && result.value) {
    try {
      await mergedOptions.onConfirm(result.value);
    } catch (error) {
      console.error("초대 처리 중 오류:", error);
      throw new Error("초대 처리 중 오류가 발생했습니다.");
    }
  }

  return result;
};
