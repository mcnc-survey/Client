<!--
  Author: 배수호
  Description: 텍스트 답변 설문 항목 컴포넌트
  - 사용자가 긴 또는 짧은 답변을 입력할 수 있는 텍스트 영역 제공
  - 답변 입력 시 자동으로 텍스트 영역 크기를 조정
  - 필수 답변 항목에 대한 안내 메시지 표시
  - 입력된 답변은 부모 컴포넌트로 전달되어 처리됨
  - 최대 글자 수는 긴 답변(2000자)과 짧은 답변(100자)으로 구분
-->

<template>
  <div class="survey-box">
    <h3 class="question-title">{{ question }}</h3>
    <textarea
      class="answer-field"
      rows="3"
      :maxlength="isLongAnswer ? 2000 : 100"
      placeholder="답변을 입력하세요."
      v-model="answer"
      value=""
      @input="handleInput"
      @focusout="getAnswer(answer)"
    ></textarea>
    <p class="char-count">{{ `${answer.length} / ${maxLength} 자` }}</p>
    <p v-if="required" class="required-text">* 필수 답변</p>
  </div>
</template>

<script>
export default {
  props: {
    question: String,
    required: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "LONG_ANSWER", // 기본값: LONG_ANSWER
    },
    initAnswer: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      answer: this.initAnswer,
    };
  },
  computed: {
    isLongAnswer() {
      return this.type === "LONG_ANSWER";
    },
    maxLength() {
      return this.isLongAnswer ? 2000 : 100;
    },
  },
  methods: {
    handleInput(event) {
      this.autoResize(event);
    },
    autoResize(event) {
      const textarea = event.target;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    },
    getAnswer(answer) {
      this.answer = answer;
      this.$emit("update:selected", answer); // 부모에게 선택된 값 전달
    },
  },
};
</script>

<style scoped>
.survey-box {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.04);
  padding: 20px;
  width: 100%;
  margin-bottom: 20px;
}

.question-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.answer-field {
  width: 100%;
  padding: 10px;
  background-color: #f7f9fb;
  border-radius: 13.94px;
  font-size: 14px;
  resize: none;
  overflow: hidden;
  border: none; /* Remove border */
}

textarea {
  outline: none;
}
textarea:focus {
  border: 1px solid #bfd0e0; /* 원하는 색으로 변경 */
}

.char-count {
  font-size: 12px;
  color: gray;
  text-align: right;
  margin-top: 5px;
}

.required-text {
  font-size: 12px;
  color: red;
  margin-top: 5px;
}
</style>
