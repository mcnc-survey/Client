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
        />
        <span class="custom-radio"></span>
      </label>

      <label
        v-if="etc"
        :class="{ selected: isEtcSelected }"
        @click.prevent="toggleEtc"
      >
        <input
          type="text"
          placeholder="기타"
          class="etc-input"
          maxlength="100"
          v-model="etcValue"
          @input="handleEtcInput"
        />
        <input type="radio" class="radio-input" :checked="isEtcSelected" />
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
      default: "",
    },
    setEtc: {
      type: Function,
      required: true,
    },
    initEtc: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectedOption: this.initSelected || "",
      etcValue: this.initEtc || "",
      isEtcSelected: !!this.initEtc,
    };
  },
  methods: {
    toggleOption(option) {
      if (this.selectedOption === option) {
        // 같은 옵션을 다시 클릭하면 선택 해제
        this.selectedOption = "";
        this.$emit("update:selected", "");
      } else {
        // 새로운 옵션 선택
        this.selectedOption = option;
        this.isEtcSelected = false;
        this.etcValue = "";
        this.setEtc("");
        this.$emit("update:selected", option);
      }
    },
    toggleEtc() {
      this.isEtcSelected = !this.isEtcSelected;

      if (!this.isEtcSelected) {
        // 기타 선택 해제
        this.selectedOption = "";
        this.etcValue = "";
        this.setEtc("");
        this.$emit("update:selected", "");
      } else {
        // 기타 선택
        this.selectedOption = "";
        this.setEtc(this.etcValue);
        this.$emit("update:selected", "");
      }
    },
    handleEtcInput() {
      if (this.etcValue.trim()) {
        this.isEtcSelected = true;
        this.selectedOption = "";
        this.setEtc(this.etcValue);
        this.$emit("update:selected", null);
      } else {
        this.setEtc("");
        this.$emit("update:selected", "");
      }
    },
  },
  watch: {
    initSelected: {
      handler(newVal) {
        if (this.options.includes(newVal)) {
          this.selectedOption = newVal;
          this.isEtcSelected = false;
          this.etcValue = "";
          this.setEtc("");
        }
      },
      immediate: true,
    },
    initEtc: {
      handler(newVal) {
        this.etcValue = newVal || "";
        this.isEtcSelected = !!newVal;
        if (newVal) {
          this.selectedOption = "";
        }
      },
      immediate: true,
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
  background: #f7f9fb;
  border-radius: 13.94px;
  padding: 10px 15px;
  margin-bottom: 10px;
  font-size: 14px;
  position: relative;
  cursor: pointer;
}

label.selected {
  background: #bfd0e0;
}

.radio-input {
  display: none;
}

.etc-input {
  width: 100%;
  outline: none;
  border: none;
  background: none;
  color: peru;
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
  background-image: url("../../assets/images/selected.svg");
  background-repeat: no-repeat;
  background-position: center;
}

.radio-input:checked + .custom-radio::after {
  content: none;
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
