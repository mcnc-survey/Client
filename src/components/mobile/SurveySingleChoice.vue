<template>
  <div class="survey-box">
    <h3 class="question-title">{{ question }}</h3>
    <div class="options">
      <label
        v-for="(option, index) in options"
        :key="index"
        :class="{ selected: selectedOption === option }"
        @click.prevent="toggleOption(option)"
      >
        <span class="option-text">{{ option }}</span>
        <input
          type="radio"
          :name="name"
          :value="option"
          class="radio-input"
          :checked="selectedOption === option"
          @change="selectOption(option)"
        />
        <span class="custom-radio"></span>
      </label>

      <label :class="{ selected: selectedOption === etcValue }" v-if="etc">
        <input
          type="text"
          placeholder="기타"
          class="etc-input"
          maxlength="100"
          v-model="etcValue"
          @input="handleEtcInput"
        />
        <input
          type="radio"
          class="radio-input"
          :checked="selectedOption === etcValue"
          @change="selectOption(etcValue)"
        />
        <span class="custom-radio"></span>
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
      type: String,
      default: null,
    },
  },
  data() {
    return {
      selectedOption: this.initSelected || "", // 초기 선택된 옵션
      etcValue:
        this.initSelected && !this.options.includes(this.initSelected)
          ? this.initSelected
          : "", // 기타 값 초기화
    };
  },
  watch: {
    initSelected(newVal) {
      if (this.options.includes(newVal)) {
        this.selectedOption = newVal;
        this.etcValue = "";
      } else {
        this.selectedOption = "";
        this.etcValue = newVal || "";
      }
    },
  },
  methods: {
    toggleOption(option) {
      // 옵션 선택/해제 로직
      this.selectedOption = this.selectedOption === option ? "" : option;
      this.$emit("update:selected", this.selectedOption);
    },
    selectOption(option) {
      // 라디오 버튼 변경 이벤트 처리
      this.selectedOption = option;
      this.$emit("update:selected", this.selectedOption);
    },
    handleEtcInput() {
      // 기타 입력 시 selectedOption 동기화
      this.selectedOption = this.etcValue;
      this.$emit("update:selected", this.selectedOption);
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

.options label {
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

.options label.selected {
  background: #bfd0e0; /* 선택된 상태 배경색 */
}

.etc-input {
  width: 100%;
  outline: none;
  border: none;
  background: none;
  color: peru;
}

.options .radio-input {
  display: none; /* 기본 라디오 버튼 숨김 */
}

.custom-radio {
  width: 18px;
  height: 18px;
  border: 2px solid #000;
  border-radius: 50%;
  position: relative;
  margin-left: 10px;
}

.radio-input:checked + .custom-radio {
  background-image: url("../../assets/images/selected.svg"); /* 이미지 경로 */
  background-repeat: no-repeat;
  background-position: center;
}

.radio-input:checked + .custom-radio::after {
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
