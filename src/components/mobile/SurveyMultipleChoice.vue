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
        <input
          type="checkbox"
          class="checkbox-input"
          :checked="isEtcSelected"
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
      selectedOptions: [...this.initSelected],

      etcValue: this.initEtc,
      isEtcSelected: !!this.initEtc,
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
    toggleEtc() {
      this.isEtcSelected = !this.isEtcSelected;
      if (!this.isEtcSelected) {
        this.etcValue = "";
        this.setEtc("");
      }
    },
    handleEtcInput() {
      if (this.etcValue && !this.isEtcSelected) {
        this.isEtcSelected = true;
      }
      this.setEtc(this.etcValue);
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

.checkbox-input {
  display: none;
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
  background-image: url("../../assets/images/selected.svg");
  background-repeat: no-repeat;
  background-position: center;
}

.checkbox-input:checked + .custom-checkbox::after {
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
