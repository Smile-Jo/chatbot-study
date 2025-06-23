import Swal from 'sweetalert2';

const button = document.getElementById("dangerButton");

button.addEventListener("click", () => {
  Swal.fire({
    icon: 'warning',
    title: '정말 클릭하셨나요?',
    text: '이 버튼은 누르지 말라고 했잖아요!',
    confirmButtonText: '죄송합니다',
    confirmButtonColor: '#81c784',
    background: '#f1f8e9',
    color: '#1b5e20',
    backdrop: `rgba(130, 224, 170, 0.4)`
  });
});