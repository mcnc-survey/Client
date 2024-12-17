<template>
  <div class="survey-box">
    <h3 class="question-title">{{ question }}</h3>
    <textarea
      class="answer-field"
      rows="3"
      :maxlength="isLongAnswer ? 2000 : 100"
      placeholder="답변을 입력하세요."
      v-model="answer"
      @input="handleInput"
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
  },
  data() {
    return {
      answer: "",
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
