<template>
    <div v-if="modelValue" class="period-modal">
      <div class="modal-content">
        <h3>{{ title }}</h3>
        <div class="time-group">
          <p>시작</p>
          <div class="datetime-input">
            <div class="input-with-icon" :class="{ error: showError && !startDateTime }">
              <img src="@/assets/images/set_date.png" alt="날짜" class="input-icon" />
              <input
                type="text"
                :value="formatStartDateTime"
                readonly
                placeholder="날짜와 시간 선택"
                @click="toggleDateTimePicker('start')"
              />
            </div>
            <div
              v-if="showError && !startDateTime"
              class="error-message"
            >
              시작 날짜와 시간을 입력해주세요.
            </div>
          </div>
        </div>
  
        <div class="time-group">
          <p>종료</p>
          <div class="datetime-input">
            <div class="input-with-icon" :class="{ error: (showError && !endDateTime) || endTimeError }">
              <img src="@/assets/images/set_date.png" alt="날짜" class="input-icon" />
              <input
                type="text"
                :value="formatEndDateTime"
                readonly
                placeholder="날짜와 시간 선택"
                @click="toggleDateTimePicker('end')"
              />
            </div>
            <div
              v-if="endTimeError"
              class="error-message"
            >
              종료 시간은 현재보다 이전으로 설정할 수 없습니다
            </div>
            <div
              v-if="showError && !endDateTime"
              class="error-message"
            >
              종료 날짜와 시간을 입력해주세요.
            </div>
          </div>
        </div>
  
        <div v-if="dateOrderError" class="date-order-error">
          시작 날짜와 종료 날짜를 다시 확인해주세요.
        </div>
  
        <div v-if="showDateTimePicker" class="datetime-picker">
          <div class="calendar-section">
            <VDatePicker
              v-model="selectedDate"
              mode="single"
              @update:modelValue="handleDateSelect"
              :locale="locale"
            />
          </div>
          <div class="time-section">
            <div class="time-selector">
              <div class="time-column ampm-column">
                <div class="time-scroll">
                  <div
                    v-for="ampm in ['AM', 'PM']"
                    :key="ampm"
                    class="time-item"
                    :class="{ selected: selectedAmPm === ampm }"
                    @click="selectAmPm(ampm)"
                  >
                    {{ ampm === "AM" ? "오전" : "오후" }}
                  </div>
                </div>
              </div>
              <div class="time-column">
                <div class="time-scroll">
                  <div
                    v-for="hour in hours"
                    :key="'h' + hour"
                    class="time-item"
                    :class="{ selected: selectedHour === hour }"
                    @click="selectHour(hour)"
                  >
                    {{ hour }}
                  </div>
                </div>
              </div>
              <div class="time-divider">:</div>
              <div class="time-column">
                <div class="time-scroll">
                  <div
                    v-for="minute in minutes"
                    :key="'m' + minute"
                    class="time-item"
                    :class="{ selected: selectedMinute === minute }"
                    @click="selectMinute(minute)"
                  >
                    {{ minute.toString().padStart(2, "0") }}
                  </div>
                </div>
              </div>
            </div>
            <div class="button-group">
              <button class="confirm-btn" @click="confirmDateTime">선택 완료</button>
            </div>
          </div>
        </div>
  
        <div class="button-group">
          <button class="cancel-btn" @click="handleCancel">취소</button>
          <button class="confirm-btn" @click="handleConfirm">확인</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { DatePicker } from 'v-calendar';
  import "v-calendar/style.css";
  
  export default {
    name: 'DateTimePicker',
    
    components: {
      VDatePicker: DatePicker
    },
    
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '설문 기간'
        },
        startDateTime: {  // 부모로부터 받은 값을 사용하기 위해 추가
            type: String,
            default: null
        },
        endDateTime: {  // 부모로부터 받은 값을 사용하기 위해 추가
            type: String,
            default: null
        },
        showError: {
            type: Boolean,
            default: false
        }
    },
    
    emits: ['update:modelValue', 'update:startDateTime', 'update:endDateTime', 'cancel', 'confirm'],
    
    setup(props, { emit }) {
      const startDateTime = ref(props.startDateTime);
      const endDateTime = ref(props.endDateTime);
      const currentType = ref(null);
      const showDateTimePicker = ref(false);
      const dateOrderError = ref(false);
      const endTimeError = ref(false);
  
      // 날짜/시간 선택 관련 상태
      const selectedDate = ref(null);
      const selectedHour = ref(1);
      const selectedMinute = ref(0);
      const selectedAmPm = ref('AM');
      
      const hours = Array.from({ length: 12 }, (_, i) => i + 1);
      const minutes = [0, 30];
      
      const locale = {
        masks: {
          title: "YYYY년 M월",
        },
        weekdays: "일_월_화_수_목_금_토".split("_"),
        titleFormat: (date) => {
          return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
        },
      };
  
      // 날짜/시간 형식화
      const formatDateTime = (datetime) => {
        if (!datetime) return '';
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = date.getHours();
        const minute = String(date.getMinutes()).padStart(2, '0');
        const ampm = hour < 12 ? '오전' : '오후';
        const hour12 = hour % 12 || 12;
        
        return `${year}. ${month}. ${day} ${ampm} ${hour12}:${minute}`;
      };
  
      const formatStartDateTime = computed(() => formatDateTime(startDateTime.value));
      const formatEndDateTime = computed(() => formatDateTime(endDateTime.value));
  
      const toggleDateTimePicker = (type) => {
        currentType.value = type;
        showDateTimePicker.value = true;
        
        const currentDateTime = type === 'start' ? startDateTime.value : endDateTime.value;
        if (currentDateTime) {
          const date = new Date(currentDateTime);
          selectedDate.value = date;
          selectedAmPm.value = date.getHours() < 12 ? 'AM' : 'PM';
          selectedHour.value = date.getHours() % 12 || 12;
          selectedMinute.value = date.getMinutes();
        } else {
          selectedDate.value = null;
          selectedHour.value = 1;
          selectedMinute.value = 0;
          selectedAmPm.value = 'AM';
        }
      };
  
      const handleDateSelect = (date) => {
        selectedDate.value = date;
      };
  
      const selectHour = (hour) => {
        selectedHour.value = hour;
      };
  
      const selectMinute = (minute) => {
        selectedMinute.value = minute;
      };
  
      const selectAmPm = (ampm) => {
        selectedAmPm.value = ampm;
      };
  
      const confirmDateTime = () => {
        if (!selectedDate.value) return;
  
        let hour = selectedHour.value;
        if (selectedAmPm.value === 'PM' && hour !== 12) {
          hour += 12;
        } else if (selectedAmPm.value === 'AM' && hour === 12) {
          hour = 0;
        }
  
        const date = new Date(selectedDate.value);
        date.setHours(hour, selectedMinute.value);
  
        if (currentType.value === 'start') {
          startDateTime.value = date.toISOString();
          emit('update:startDateTime', date.toISOString());
        } else {
          endDateTime.value = date.toISOString();
          emit('update:endDateTime', date.toISOString());
        }
        
        showDateTimePicker.value = false;
      };
  
      const validateEndTime = () => {
        if (!endDateTime.value) return true;
        
        const now = new Date();
        const end = new Date(endDateTime.value);
        
        endTimeError.value = end < now;
        return !endTimeError.value;
      };
  
      const validateDateOrder = () => {
        if (!startDateTime.value || !endDateTime.value) return true;
        
        const start = new Date(startDateTime.value);
        const end = new Date(endDateTime.value);
        
        dateOrderError.value = end <= start;
        return !dateOrderError.value;
      };
  
      const handleConfirm = () => {
        if (!startDateTime.value || !endDateTime.value) return;
        
        if (!validateEndTime()) return;
        if (!validateDateOrder()) return;
        
        emit('update:modelValue', false);  // 모달 닫기
        emit('confirm', {
            startDateTime: startDateTime.value,
            endDateTime: endDateTime.value
        });
      };
  
      const handleCancel = () => {
        emit('update:modelValue', false);  // 모달 닫기
        emit('cancel');
      };
  
      return {
        startDateTime,
        endDateTime,
        showDateTimePicker,
        currentType,
        selectedDate,
        selectedHour,
        selectedMinute,
        selectedAmPm,
        dateOrderError,
        endTimeError,
        hours,
        minutes,
        locale,
        formatStartDateTime,
        formatEndDateTime,
        toggleDateTimePicker,
        handleDateSelect,
        selectHour,
        selectMinute,
        selectAmPm,
        confirmDateTime,
        handleConfirm,
        handleCancel
      };
    }
  };
  </script>

<style scoped>
.period-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 20px;
    padding: 15px 20px 20px 20px;
    width: 300px;
  }
  
  .modal-content h3 {
    font-weight: bold;
    margin-bottom: 15px;
    margin-top: 5px;
    text-align: center;
    font-family: Pretendard;
    font-size: 20px;
  }
  
  .time-group {
    margin-bottom: 15px;
  }
  
  .time-group p {
    padding-left: 5px;
    margin-bottom: 6px;
    font-size: 14px;
    color: #000;
    font-family: Pretendard;
  }
  
  .input-with-icon {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .input-with-icon.error input {
    border: 1px solid #ff6b6b;
  }
  
  .input-icon {
    position: absolute;
    top: 13px;
    left: 12px;
    width: 16px;
    height: 16px;
  }
  
  .datetime-input input {
    background: #f7f9fb;
    border: none;
    border-radius: 8px;
    padding: 12px 16px 10px 36px;
    margin-bottom: 8px;
    width: 100%;
    cursor: pointer;
    font-family: Pretendard;
    outline: none;
  }
  
  .datetime-picker {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
    padding: 15px;
  }
  
  .time-selector {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 10px 0;
  }
  
  .time-column {
    width: 45px;
    height: 120px;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .ampm-column {
    width: 50px;
  }
  
  .time-column::-webkit-scrollbar {
    display: none;
  }
  
  .time-scroll {
    padding: 30px 0;
  }
  
  .time-item {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: Pretendard;
    font-size: 16px;
    color: #666;
    transition: all 0.2s;
  }
  
  .time-item:hover {
    background: #f7f9fb;
  }
  
  .time-item.selected {
    color: #000;
    font-weight: bold;
    background: #f7f9fb;
  }
  
  .time-divider {
    font-size: 20px;
    font-weight: bold;
    color: #666;
  }
  
  .error-message {
    color: #ff6b6b;
    font-size: 12px;
    margin-top: 4px;
    padding-left: 5px;
  }
  
  .date-order-error {
    color: #ff6b6b;
    font-size: 12px;
    text-align: left;
    margin-top: 4px;
    padding-left: 5px;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }
  
  .cancel-btn,
  .confirm-btn {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: Pretendard;
    font-size: 16px;
    font-weight: bold;
  }
  
  .cancel-btn {
    background: #f2f2f2;
    color: #a8c5da;
  }
  
  .confirm-btn {
    background: #bfd0e0;
    color: #ffffff;
  }
  
  /* v-calendar Custom Styles */
  :deep(.vc-container) {
    border: none;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-bottom: 8px;
    width: 100%;
    height: 240px;
  }
  
  :deep(.vc-header) {
    padding: 4px 0 2px 0;
    width: 100%;
  }
  
  :deep(.vc-title) {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    margin-top: -8px;
    background: none;
  }
  
  :deep(.vc-arrow) {
    background: none !important;
  }
  
  :deep(.vc-nav-title) {
    background: none;
  }
  
  :deep(.vc-weeks) {
    padding: 0 12px;
    width: 100%;
    margin-top: 10px;
    margin-left: 13px;
  }
  
  :deep(.vc-week) {
    margin-left: 0 !important;
    transform: translateX(-13.5px) !important;
  }
  
  :deep(.vc-weekday) {
    font-size: 12px;
    color: #666;
    font-weight: 600;
    padding: 5px 0;
    width: calc(100% / 7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  :deep(.vc-day) {
    padding: 2px 0;
    width: 100%;
    min-width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  :deep(.vc-day-content) {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    border-radius: 50%;
    margin: 0;
  }
  
  :deep(.vc-day.is-today .vc-day-content) {
    background-color: #a8c5da;
    color: #ffffff;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>