<template>
  <div class="survey-box">
    <h3 class="question-title">{{ question }}</h3>
    <div class="options">
      <label
        v-for="(option, index) in options"
        :key="index"
        :class="{ selected: selectedOptions.includes(option) }"
        @click.prevent="toggleOption(option)"
      >
        <span class="option-text">{{ option }}</span>
        <input
          type="checkbox"
          :name="name"
          :value="option"
          class="checkbox-input"
          :checked="selectedOptions.includes(option)"
        />
        <span class="custom-checkbox"></span>
      </label>

      <label
        :class="{ selected: selectedOptions.includes(etcValue) }"
        v-if="etc"
        @click.prevent="toggleOption(etcValue)"
      >
        <input
          type="text"
          placeholder="기타"
          class="etc-input"
          maxlength="100"
          v-model="etcValue"
          @input="handleEtcInput"
        />
        <input
          type="checkbox"
          class="checkbox-input"
          :checked="selectedOptions.includes(etcValue)"
        />
        <span class="custom-checkbox"></span>
      </label>
    </div>
    <p v-if="required" class="required-text">* 필수 선택</p>
  </div>
</template>

<script>
export default {
  props: {
    question: String,
    options: Array,
    name: String,
    etc: Boolean,
    required: {
      type: Boolean,
      default: false,
    },
    initSelected: {
      type: Array,
      default: () => [],
    },
    sdf: {
      type: Function, // 함수 타입 지정
      required: true, // 반드시 전달되어야 함
    },
  },
  data() {
    return {
      selectedOptions: [...this.initSelected], // 초기 선택된 옵션 배열에서 공백을 제거
    };
  },
  methods: {
    toggleOption(option) {
      if (this.selectedOptions.includes(option)) {
        this.selectedOptions = this.selectedOptions.filter(
          (item) => item !== option
        );
      } else {
        this.selectedOptions.push(option);
      }
      this.$emit("update:selected", this.selectedOptions);
    },
    handleEtcInput() {
      this.invokeSdf(this.etcValue);
    },
    invokeSdf(value) {
      this.sdf(value); // 전달받은 함수 호출
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
  margin-bottom: 20px;
  width: 100%;
}

.question-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f9fb; /* 기본 배경색 */
  border-radius: 13.94px; /* 라운드 처리 */
  padding: 10px 15px;
  margin-bottom: 10px;
  font-size: 14px;
  position: relative;
}

label.selected {
  background: #bfd0e0; /* 선택된 상태 배경색 */
}

.checkbox-input {
  display: none; /* 기본 체크박스 숨김 */
}

.etc-input {
  width: 100%;
  outline: none;
  border: none;
  background: none;
  color: peru;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #000;
  border-radius: 50%;
  position: relative;
  margin-left: 10px;
}

.checkbox-input:checked + .custom-checkbox {
  background-image: url("../../assets/images/selected.svg"); /* 이미지 경로 */
  background-repeat: no-repeat;
  background-position: center;
}

.checkbox-input:checked + .custom-checkbox::after {
  content: none; /* 기본 동그라미 제거 */
}

.option-text {
  flex-grow: 1;
  text-align: left;
}

.required-text {
  font-size: 12px;
  color: red;
  margin-top: 5px;
}
</style>
