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
          @change="selectOption(option)"
        />
        <span class="custom-checkbox"></span>
      </label>
    </div>
    <p v-if="required" class="required-text">* 필수 선택</p>
    <!-- Conditionally render the required text -->
  </div>
</template>

<script>
export default {
  props: {
    question: String,
    options: Array,
    name: String,
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedOptions: [],
    };
  },
  methods: {
    toggleOption(option) {
      // 선택한 옵션이 이미 존재하면 제거, 아니면 추가
      if (this.selectedOptions.includes(option)) {
        this.selectedOptions = this.selectedOptions.filter(
          (item) => item !== option
        );
      } else {
        this.selectedOptions.push(option);
      }
      this.$emit("update:selected", this.selectedOptions.join("|`|"));
    },
    selectOption(option) {
      // 체크박스 변경 이벤트 처리
      if (this.selectedOptions.includes(option)) {
        this.selectedOptions = this.selectedOptions.filter(
          (item) => item !== option
        );
      } else {
        this.selectedOptions.push(option);
      }
      this.$emit("update:selected", this.selectedOptions.join("|`|"));
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

.options .checkbox-input {
  display: none; /* 기본 체크박스 숨김 */
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
