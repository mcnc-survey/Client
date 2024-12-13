<template>
  <div class="period-modal">
    <div class="modal-content">
      <h3>설문 기간</h3>
      <div class="time-group">
        <p>시작</p>
        <div class="date-input">
          <div
            class="input-with-icon"
            :class="{ error: showError && !modalStartDate }"
          >
            <img
              src="@/assets/images/set_date.svg"
              alt="날짜"
              class="input-icon"
            />
            <input
              type="text"
              v-model="modalStartDate"
              readonly
              placeholder="날짜 선택"
              @click="toggleStartCalendar"
            />
          </div>
          <VDatePicker
            v-if="showStartCalendar"
            v-model="selectedStartDate"
            @click:outside="showStartCalendar = false"
            mode="single"
            @update:modelValue="updateStartDate"
            class="calendar-popup"
            :locale="locale"
          />
        </div>
        <div class="time-input">
          <div
            class="input-with-icon"
            :class="{ error: showError && !startTime }"
          >
            <img
              src="@/assets/images/set_time.svg"
              alt="시간"
              class="input-icon"
            />
            <input
              type="text"
              :value="startTime ? formatDisplayTime(startTime) : ''"
              readonly
              placeholder="시간 선택"
              @click="toggleTimePicker('start')"
            />
          </div>
          <!-- 시작 시간 선택 드롭다운 -->
          <div
            v-if="showTimePicker && currentTimeInput === 'start'"
            class="time-picker-dropdown"
          >
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
              <button class="cancel-btn" @click="closeTimePicker">
                취소
              </button>
              <button class="confirm-btn" @click="confirmTime">확인</button>
            </div>
          </div>
        </div>
        <div
          v-if="showError && (!modalStartDate || !startTime)"
          class="error-message"
        >
          시작 날짜와 시간을 입력해주세요.
        </div>
      </div>

      <div class="time-group">
        <p>종료</p>
        <div class="date-input">
          <div
            class="input-with-icon"
            :class="{ error: (showError && !modalEndDate) || endTimeError }"
          >
            <img
              src="@/assets/images/set_date.svg"
              alt="날짜"
              class="input-icon"
            />
            <input
              type="text"
              v-model="modalEndDate"
              readonly
              placeholder="날짜 선택"
              @click="toggleEndCalendar"
            />
          </div>
          <VDatePicker
            v-if="showEndCalendar"
            v-model="selectedEndDate"
            @click:outside="showEndCalendar = false"
            mode="single"
            @update:modelValue="updateEndDate"
            class="calendar-popup"
            :locale="locale"
          />
        </div>
        <div class="time-input">
          <div
            class="input-with-icon"
            :class="{ error: (showError && !endTime) || endTimeError }"
          >
            <img
              src="@/assets/images/set_time.svg"
              alt="시간"
              class="input-icon"
            />
            <input
              type="text"
              :value="endTime ? formatDisplayTime(endTime) : ''"
              readonly
              placeholder="시간 선택"
              @click="toggleTimePicker('end')"
            />
          </div>
          <!-- 종료 시간 선택 드롭다운 -->
          <div
            v-if="showTimePicker && currentTimeInput === 'end'"
            class="time-picker-dropdown"
          >
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
              <button class="cancel-btn" @click="closeTimePicker">
                취소
              </button>
              <button class="confirm-btn" @click="confirmTime">확인</button>
            </div>
          </div>
          <div
            v-if="endTimeError"
            class="end-time-error"
          >
            종료 시간은 현재보다 이전으로 설정할 수<br>없습니다
          </div>
        </div>
        <div
          v-if="showError && (!modalEndDate || !endTime)"
          class="error-message"
        >
          종료 날짜와 시간을 입력해주세요.
        </div>
      </div>

      <div v-if="dateOrderError" class="date-order-error">
        시작 날짜와 종료 날짜를 다시 확인해주세요.
      </div>

      <div class="button-group">
        <button class="cancel-btn" @click="handleCancel">취소</button>
        <button class="confirm-btn" @click="handleConfirm">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, watch } from 'vue';
import { DatePicker } from 'v-calendar';
import "v-calendar/style.css";

export default {
  name: 'PeriodModalComponent',
  
  components: {
    VDatePicker: DatePicker
  },
  
  props: {
    showPeriodModal: {
      type: Boolean,
      required: true
    },
    initialStartDate: {
      type: String,
      default: ''
    },
    initialStartTime: {
      type: String,
      default: ''
    },
    initialEndDate: {
      type: String,
      default: ''
    },
    initialEndTime: {
      type: String,
      default: ''
    }
  },
  
  emits: ['cancel', 'confirm'],
  
  setup(props, { emit }) {
    // 날짜와 시간 상태 관리
    const modalStartDate = ref(props.initialStartDate);
    const modalEndDate = ref(props.initialEndDate);
    const startTime = ref(props.initialStartTime);
    const endTime = ref(props.initialEndTime);

    // 캘린더 상태
    const showStartCalendar = ref(false);
    const showEndCalendar = ref(false);
    const selectedStartDate = ref(props.initialStartDate ? parseDateString(props.initialStartDate) : null);
    const selectedEndDate = ref(props.initialEndDate ? parseDateString(props.initialEndDate) : null);
    const tempStartDate = ref(selectedStartDate.value);
    const tempEndDate = ref(selectedEndDate.value);

    // 시간 선택기 상태
    const showTimePicker = ref(false);
    const currentTimeInput = ref(null);
    
    // 초기 시간값 설정
    const initialTimeValues = initializeTimeValues(props.initialStartTime);
    const selectedHour = ref(initialTimeValues.hour);
    const selectedMinute = ref(initialTimeValues.minute);
    const selectedAmPm = ref(initialTimeValues.ampm);

    // 에러 상태
    const showError = ref(false);
    const dateOrderError = ref(false);
    const endTimeError = ref(false);

    watch(() => props.showPeriodModal, (newVal) => {
    if (newVal) {
      modalStartDate.value = props.initialStartDate;
      modalEndDate.value = props.initialEndDate;
      startTime.value = props.initialStartTime;
      endTime.value = props.initialEndTime;
      
      if (props.initialStartDate) {
        selectedStartDate.value = new Date(parseDateString(props.initialStartDate));
        tempStartDate.value = selectedStartDate.value;
      }
      
      if (props.initialEndDate) {
        selectedEndDate.value = new Date(parseDateString(props.initialEndDate));
        tempEndDate.value = selectedEndDate.value;
      }
    }
  });

    // 상수
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

    // 헬퍼 함수들
    function parseDateString(dateStr) {
      const [year, month, day] = dateStr.split('.').map(s => s.trim());
      return new Date(year, parseInt(month) - 1, day);
    }

    function initializeTimeValues(timeStr) {
      if (!timeStr) return { hour: 1, minute: 0, ampm: 'AM' };
      const [hours, minutes] = timeStr.split(':').map(Number);
      return {
        hour: hours % 12 || 12,
        minute: minutes,
        ampm: hours < 12 ? 'AM' : 'PM'
      };
    }

    const formatDate = (date) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}. ${month}. ${day}`;
    };

    const formatDisplayTime = (time) => {
      if (!time) return "";
      const [hours, minutes] = time.split(":").map(Number);
      const ampm = hours < 12 ? "오전" : "오후";
      const hour = hours % 12 || 12;
      return `${ampm} ${hour}:${minutes.toString().padStart(2, "0")}`;
    };

    const updateStartDate = (date) => {
      tempStartDate.value = date;
      modalStartDate.value = formatDate(date);
    };

    const updateEndDate = (date) => {
      tempEndDate.value = date;
      modalEndDate.value = formatDate(date);
    };

    const toggleStartCalendar = () => {
      showEndCalendar.value = false;
      showTimePicker.value = false;
      showStartCalendar.value = !showStartCalendar.value;
    };

    const toggleEndCalendar = () => {
      showStartCalendar.value = false;
      showTimePicker.value = false;
      showEndCalendar.value = !showEndCalendar.value;
    };

    const toggleTimePicker = (type) => {
      showStartCalendar.value = false;
      showEndCalendar.value = false;

      if (currentTimeInput.value === type) {
        closeTimePicker();
      } else {
        showTimePicker.value = true;
        currentTimeInput.value = type;

        // 현재 설정된 시간 값을 사용
        const currentTime = type === "start" ? startTime.value : endTime.value;
        if (currentTime) {
          const [hours, minutes] = currentTime.split(":").map(Number);
          selectedAmPm.value = hours < 12 ? "AM" : "PM";
          selectedHour.value = hours % 12 || 12;
          selectedMinute.value = minutes;
        } else {
          selectedHour.value = 1;
          selectedMinute.value = 0;
          selectedAmPm.value = "AM";
        }

        nextTick(() => {
          scrollToSelected();
        });
      }
    };

    const closeTimePicker = () => {
      showTimePicker.value = false;
      currentTimeInput.value = null;
    };

    const selectHour = (hour) => {
      selectedHour.value = hour;
      nextTick(() => {
        scrollToSelected();
      });
    };

    const selectMinute = (minute) => {
      selectedMinute.value = minute;
      nextTick(() => {
        scrollToSelected();
      });
    };

    const selectAmPm = (ampm) => {
      selectedAmPm.value = ampm;
      nextTick(() => {
        scrollToSelected();
      });
    };

    const confirmTime = () => {
      let hour = selectedHour.value;
      if (selectedAmPm.value === "PM" && hour !== 12) {
        hour += 12;
      } else if (selectedAmPm.value === "AM" && hour === 12) {
        hour = 0;
      }

      const time = `${hour.toString().padStart(2, "0")}:${selectedMinute.value
        .toString()
        .padStart(2, "0")}`;
      if (currentTimeInput.value === "start") {
        startTime.value = time;
      } else {
        endTime.value = time;
      }
      closeTimePicker();
    };

    const scrollToSelected = () => {
      const timeColumns = document.querySelectorAll(".time-column");
      timeColumns.forEach((column) => {
        const selectedItem = column.querySelector(".selected");
        if (selectedItem) {
          const scrollPosition =
            selectedItem.offsetTop -
            column.offsetHeight / 2 +
            selectedItem.offsetHeight / 2;
          column.scrollTop = scrollPosition;
        }
      });
    };

    const getDateTime = (dateStr, timeStr) => {
      const [year, month, day] = dateStr.split(".").map((s) => s.trim());
      const [hours, minutes] = timeStr.split(":").map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    };

    const validateEndTime = () => {
      if (!modalEndDate.value || !endTime.value) return true;
      
      const endDateTime = getDateTime(modalEndDate.value, endTime.value);
      const now = new Date();
      
      endTimeError.value = endDateTime < now;
      return !endTimeError.value;
    };

    const validateDateOrder = () => {
      if (!modalStartDate.value || !modalEndDate.value || !startTime.value || !endTime.value) return true;
      
      const startDateTime = getDateTime(modalStartDate.value, startTime.value);
      const endDateTime = getDateTime(modalEndDate.value, endTime.value);
      
      dateOrderError.value = endDateTime <= startDateTime;
      return !dateOrderError.value;
    };

    const handleConfirm = () => {
      if (!modalStartDate.value || !modalEndDate.value || !startTime.value || !endTime.value) {
        showError.value = true;
        return;
      }
      
      if (!validateEndTime()) {
        showError.value = true;
        return;
      }
      
      if (!validateDateOrder()) {
        showError.value = true;
        return;
      }

      emit('confirm', {
        startDate: modalStartDate.value,
        endDate: modalEndDate.value,
        startTime: startTime.value,
        endTime: endTime.value
      });
    };

    const handleCancel = () => {
      emit('cancel');
    };

    return {
      modalStartDate,
      modalEndDate,
      startTime,
      endTime,
      showStartCalendar,
      showEndCalendar,
      showTimePicker,
      currentTimeInput,
      selectedHour,
      selectedMinute,
      selectedAmPm,
      selectedStartDate,
      selectedEndDate,
      dateOrderError,
      endTimeError,
      hours,
      minutes,
      locale,
      updateStartDate,
      updateEndDate,
      formatDate,
      toggleStartCalendar,
      toggleEndCalendar,
      toggleTimePicker,
      closeTimePicker,
      selectHour,
      selectMinute,
      selectAmPm,
      formatDisplayTime,
      confirmTime,
      scrollToSelected,
      handleConfirm,
      handleCancel,
      showError
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

.date-input input,
.time-input input {
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

.calendar-popup {
 position: absolute;
 z-index: 1000;
 margin-top: 4px;
 width: 100%;
}

/* 시간 선택기 관련 스타일 */
.time-input {
 position: relative;
}

.time-picker-dropdown {
 position: absolute;
 top: 100%;
 left: 0;
 right: 0;
 background: white;
 border-radius: 8px;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 margin-top: 4px;
 z-index: 1000;
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

.end-time-error {
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

/* 버튼 스타일 */
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

/* v-calendar 커스텀 스타일 */
:deep(.vc-container) {
 border: none;
 background: white;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 border-radius: 8px;
 margin-bottom: 8px;
 width: 100%;
 height: auto;
 min-height: 240px;
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