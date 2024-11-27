<template>
  <div class="survey-create">
    <div class="header">
      <h2>설문조사 생성</h2>
      <div class="header-buttons">
        <button class="preview-btn" @click="openPreview">미리보기</button>
        <button class="save-btn" @click="validateAndSave">저장</button>
      </div>
    </div>
    <div class="create-container" ref="createContainer">
      <div class="content-area">
        <!-- 메인 설문 영역 -->
        <div class="survey-container">
          <div class="title-container" @click="selectTitleContainer" :class="{ error: showTitleError }">
            <!-- 설문 제목 입력 -->
            <div class="input-wrapper">
              <textarea
                v-model="title"
                placeholder="설문 제목 입력"
                class="title-input"
                @input="adjustHeight"
                @focus="titleFocused = true"
                @blur="titleFocused = false"
                rows="1"
              ></textarea>
              <div class="underline" :class="{ focused: titleFocused }"></div>
            </div>

            <!-- 설명 입력 -->
            <div class="input-wrapper">
              <textarea
                v-model="description"
                placeholder="설문 설명 입력"
                class="description-input"
                @input="adjustHeight"
                @focus="descFocused = true"
                @blur="descFocused = false"
                rows="1"
              ></textarea>
              <div class="underline" :class="{ focused: descFocused }"></div>
            </div>

            <!-- 설문 기간 선택 -->
            <div class="survey-period">
              <div class="period-select" @click="openPeriodModal">
                <img
                  src="@/assets/images/edit_date.png"
                  alt="달력"
                  class="calendar-icon"
                />
                {{ formattedPeriod }}
              </div>
            </div>
            <div v-if="showTitleError" class="error-message">
              설문 제목을 입력해주세요.
            </div>
          </div>

          <!-- 질문 컨테이너들 -->
          <div class="questions-area">
            <div
              v-for="(question, index) in questions"
              :key="index"
              class="question-wrapper"
            >
              <div
                ref="questionContainer"
                class="question-container"
                @click="selectQuestion(index)"
                :class="{ selected: selectedQuestionIndex === index, error: questionErrors[index] }"
              >
                <component
                  :is="getQuestionComponent(question.type)"
                  :question="question"
                  @update="updateQuestion(index, $event)"
                  @delete="deleteQuestion(index)"
                  @copy="copyQuestion(index)"
                />
                <div v-if="questionErrors[index]" class="error-message">
                  질문과 옵션을 모두 입력해주세요.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 사이드 영역 -->
        <div class="side-container" :style="{ transform: `translateY(${sideTabTop}px)` }">
          <QuestionTypeTab
            :selected-question-index="selectedQuestionIndex"
            :is-title-selected="isTitleContainerSelected"
            @change-type="changeQuestionType"
            @add-question="addNewQuestion"
          />
        </div>
      </div>
    </div>

    <!-- 설문 기간 모달 -->
    <div v-if="showPeriodModal" class="period-modal">
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
                src="@/assets/images/set_date.png"
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
                src="@/assets/images/set_time.png"
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
                src="@/assets/images/set_date.png"
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
                src="@/assets/images/set_time.png"
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
          <button class="cancel-btn" @click="closePeriodModal">취소</button>
          <button class="confirm-btn" @click="confirmPeriod">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { debounce } from 'lodash';
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
import QuestionTypeTab from "@/components/QuestionTypeTab.vue";
import SingleChoiceQuestion from "@/components/SingleChoiceQuestion.vue";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion.vue";
import GridQuestion from "@/components/GridQuestion.vue";
import ShortAnswerQuestion from "@/components/ShortAnswerQuestion.vue";
import LongAnswerQuestion from "@/components/DescriptiveAnswerQuestion.vue";

export default {
  components: {
    VDatePicker: DatePicker,
    QuestionTypeTab,
    SingleChoiceQuestion,
    MultipleChoiceQuestion,
    GridQuestion,
    ShortAnswerQuestion,
    LongAnswerQuestion,
  },

  setup() {
    const router = useRouter();
    // Refs for template elements
    const createContainer = ref(null);
    const questionContainer = ref([]);

    // Form data
    const title = ref("");
    const description = ref("");
    const titleFocused = ref(false);
    const descFocused = ref(false);
    const showTitleError = ref(false);
    const questionErrors = ref({});

    // Period modal state
    const showPeriodModal = ref(false);
    const startDate = ref("");
    const startTime = ref("");
    const endDate = ref("");
    const endTime = ref("");
    const showStartCalendar = ref(false);
    const showEndCalendar = ref(false);
    const showTimePicker = ref(false);
    const currentTimeInput = ref(null);
    const selectedHour = ref(1);
    const selectedMinute = ref(0);
    const selectedAmPm = ref("AM");
    const modalStartDate = ref("");
    const modalEndDate = ref("");
    const showError = ref(false);
    const dateOrderError = ref(false);
    const endTimeError = ref(false);

    const isTitleContainerSelected  = ref(false);
    // Calendar data
    const selectedStartDate = ref(null);
    const selectedEndDate = ref(null);
    const tempStartDate = ref(null);
    const tempEndDate = ref(null);

    // Question data
    const selectedQuestionIndex = ref(0);
    const sideTabTop = ref(0);
    const questions = ref([
      {
        id: Date.now(),
        type: "single",
        title: "",
        required: false,
      },
    ]);

    // Constants
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

    // Computed
    const formattedPeriod = computed(() => {
      if (!startDate.value && !endDate.value) {
        return "시작 날짜 ~ 종료 날짜";
      }
      return `${startDate.value} ${
        startTime.value ? formatDisplayTime(startTime.value) : ""
      } ~ ${endDate.value} ${
        endTime.value ? formatDisplayTime(endTime.value) : ""
      }`.trim();
    });

    // Methods
    const updateSideTabPosition = () => {
      if (selectedQuestionIndex.value !== null && 
          questionContainer.value[selectedQuestionIndex.value]) {
        const selectedElement = questionContainer.value[selectedQuestionIndex.value];
        const containerRect = createContainer.value.getBoundingClientRect();
        const titleContainer = document.querySelector('.title-container');
        const rect = selectedElement.getBoundingClientRect();
        // title-container의 시작 위치를 최소값으로 설정
        const minTop = titleContainer.getBoundingClientRect().top - containerRect.top;
        // create-container의 끝에서 사이드탭의 높이만큼 뺀 위치를 최대값으로 설정
        const maxTop = containerRect.height - 300; // 300은 사이드탭의 대략적인 높이
        // 현재 선택된 질문의 상대적 위치 계산
        const relativeTop = rect.top - containerRect.top;
        // 범위 내로 제한
        const constrainedTop = Math.max(minTop, Math.min(relativeTop, maxTop));
        sideTabTop.value = constrainedTop;
      }
    };

    const debouncedUpdatePosition = debounce(updateSideTabPosition, 100);

    const adjustHeight = (e) => {
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const selectTitleContainer = () => {
      selectedQuestionIndex.value = null;
      isTitleContainerSelected.value = true;
      
      const titleContainer = document.querySelector('.title-container');
      if (titleContainer && createContainer.value) {
        const containerRect = createContainer.value.getBoundingClientRect();
        const rect = titleContainer.getBoundingClientRect();
        sideTabTop.value = rect.top - containerRect.top;
      }
    };

    const selectQuestion = (index) => {
      selectedQuestionIndex.value = index;
      isTitleContainerSelected.value = false;
      
      if (questionContainer.value[index]) {
        const element = questionContainer.value[index];
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
          updateSideTabPosition();
        }, 300);
      }
    };

    const changeQuestionType = (newType) => {
      if (selectedQuestionIndex.value !== null) {
        questions.value[selectedQuestionIndex.value] = {
          ...questions.value[selectedQuestionIndex.value],
          type: newType,
        };
        // 질문 유형이 바뀔 때도 사이드탭 위치 업데이트
        nextTick(() => {
          updateSideTabPosition();
        });
      }
    };

    const addNewQuestion = () => {
      const newQuestion = {
        id: Date.now(),
        type: "single",
        title: "",
        required: false,
      };

      const insertIndex = selectedQuestionIndex.value !== null
        ? selectedQuestionIndex.value + 1
        : 0;  // 제목 컨테이너가 선택된 경우 맨 앞에 추가

      questions.value.splice(insertIndex, 0, newQuestion);
      nextTick(() => {
        selectQuestion(insertIndex);
      });
    };

    const copyQuestion = (index) => {
      const copiedQuestion = {
        ...questions.value[index],
        id: Date.now(),
      };
      questions.value.splice(index + 1, 0, copiedQuestion);
      nextTick(() => {
        selectQuestion(index + 1);
      });
    };

    const updateQuestion = (index, updatedQuestion) => {
      questions.value[index] = updatedQuestion;
    };

    const deleteQuestion = (index) => {
      questions.value.splice(index, 1);
      if (questions.value.length === 0) {
        addNewQuestion();
      } else if (selectedQuestionIndex.value === index) {
        selectedQuestionIndex.value = Math.min(index, questions.value.length - 1);
        updateSideTabPosition();
      }
    };

    const getQuestionComponent = (type) => {
      const components = {
        single: "SingleChoiceQuestion",
        multiple: "MultipleChoiceQuestion",
        grid: "GridQuestion",
        short: "ShortAnswerQuestion",
        long: "LongAnswerQuestion",
      };
      return components[type];
    };

    // Period related methods
    const openPeriodModal = () => {
      modalStartDate.value = startDate.value;
      modalEndDate.value = endDate.value;
      selectedStartDate.value = startDate.value ? tempStartDate.value : null;
      selectedEndDate.value = endDate.value ? tempEndDate.value : null;
      showPeriodModal.value = true;
      validateEndTime();
    };

    const closePeriodModal = () => {
      showError.value = false;
      dateOrderError.value = false;
      endTimeError.value = false;
      showPeriodModal.value = false;
      showStartCalendar.value = false;
      showEndCalendar.value = false;
      showTimePicker.value = false;

      if (!startDate.value && !endDate.value) {
        modalStartDate.value = "";
        modalEndDate.value = "";
        tempStartDate.value = null;
        tempEndDate.value = null;
        selectedStartDate.value = null;
        selectedEndDate.value = null;
        startTime.value = "";
        endTime.value = "";
      }
    };

    const validateEndTime = () => {
      if (!modalEndDate.value || !endTime.value) return;
      
      const endDateTime = getDateTime(modalEndDate.value, endTime.value);
      const now = new Date();
      
      endTimeError.value = endDateTime < now;
      return endDateTime >= now;
    };

    const confirmPeriod = () => {
      showError.value =
        !modalStartDate.value ||
        !modalEndDate.value ||
        !startTime.value ||
        !endTime.value;

      if (showError.value) return;

      // 종료 시간 검증
      if (!validateEndTime()) {
        return;
      }

      const startDateTime = getDateTime(modalStartDate.value, startTime.value);
      const endDateTime = getDateTime(modalEndDate.value, endTime.value);

      if (endDateTime <= startDateTime) {
        dateOrderError.value = true;
        return;
      }

      dateOrderError.value = false;
      selectedStartDate.value = tempStartDate.value;
      selectedEndDate.value = tempEndDate.value;
      startDate.value = modalStartDate.value;
      endDate.value = modalEndDate.value;
      closePeriodModal();
    };

    const updateStartDate = (date) => {
      tempStartDate.value = date;
      modalStartDate.value = formatDate(date);
    };

    const updateEndDate = (date) => {
      tempEndDate.value = date;
      modalEndDate.value = formatDate(date);
    };

    const formatDate = (date) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}. ${month}. ${day}`;
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

    const formatDisplayTime = (time) => {
      if (!time) return "";
      const [hours, minutes] = time.split(":").map(Number);
      const ampm = hours < 12 ? "오전" : "오후";
      const hour = hours % 12 || 12;
      return `${ampm} ${hour}:${minutes.toString().padStart(2, "0")}`;
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

      timeColumns.forEach((column, index) => {
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

    const openPreview = () => {
      // 현재 작성 중인 설문 데이터
      const previewData = {
        title: title.value,
        description: description.value,
        startDate: startDate.value,
        endDate: endDate.value,
        startTime: startTime.value,
        endTime: endTime.value,
        questions: questions.value
      };

      // 데이터를 sessionStorage에 임시 저장
      sessionStorage.setItem('surveyPreviewData', JSON.stringify(previewData));
      
      // 새 탭에서 미리보기 페이지 열기
      const route = router.resolve({ name: 'SurveyPreview' });
      window.open(route.href, '_blank');
    };

    // 저장 버튼 클릭 시 실행될 함수
    const validateAndSave = () => {
      let isValid = true;
      
      // 제목 검증
      showTitleError.value = !title.value.trim();
      if (showTitleError.value) {
        isValid = false;
      }

      // 질문 검증
      questionErrors.value = {};
      questions.value.forEach((question, index) => {
        let hasError = false;
        
        // 질문 제목이 비어있는지 확인
        if (!question.title.trim()) {
          hasError = true;
        }

        // 질문 유형별 옵션 검증
        if (question.type === 'single' || question.type === 'multiple') {
          // 객관식/체크박스 질문의 경우
          if (!question.options || question.options.length === 0 || 
              question.options.some(opt => !opt.text.trim())) {
            hasError = true;
          }
        } else if (question.type === 'grid') {
          // 그리드 질문의 경우
          if (!question.rows || question.rows.length === 0 || 
              question.rows.some(row => !row.text.trim()) ||
              !question.columns || question.columns.length === 0 ||
              question.columns.some(col => !col.text.trim())) {
            hasError = true;
          }
        }
        // short와 long 타입은 추가 옵션이 필요 없으므로 제목만 검증

        if (hasError) {
          questionErrors.value[index] = true;
          isValid = false;
        }
      });

      if (!isValid) {
        // 첫 번째 에러가 있는 요소로 스크롤
        if (showTitleError.value) {
          document.querySelector('.title-container').scrollIntoView({ behavior: 'smooth' });
        } else {
          const firstErrorIndex = Object.keys(questionErrors.value)[0];
          questionContainer.value[firstErrorIndex]?.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // 모든 검증이 통과되면 저장 처리
      saveSurvey();
    };

    // 저장 처리 함수
    const saveSurvey = () => {
      router.push({ name: "SurveyCompletion" }).catch((error) => {
        console.error("SurveyCompletion 페이지로 이동 실패:", error);
      });
    };

    // Lifecycle hooks
    onMounted(() => {
      nextTick(() => {
        updateSideTabPosition();
        window.addEventListener("resize", debouncedUpdatePosition);
        window.addEventListener("scroll", debouncedUpdatePosition); // 스크롤 이벤트 추가
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", debouncedUpdatePosition);
      window.removeEventListener("scroll", debouncedUpdatePosition); // 스크롤 이벤트 제거
    });

    return {
      createContainer,
      questionContainer,
      title,
      description,
      titleFocused,
      descFocused,
      showPeriodModal,
      startDate,
      startTime,
      endDate,
      endTime,
      showStartCalendar,
      showEndCalendar,
      showTimePicker,
      currentTimeInput,
      selectedHour,
      selectedMinute,
      selectedAmPm,
      modalStartDate,
      modalEndDate,
      showError,
      dateOrderError,
      endTimeError,
      selectedStartDate,
      selectedEndDate,
      selectedQuestionIndex,
      sideTabTop,
      questions,
      hours,
      minutes,
      locale,
      formattedPeriod,
      adjustHeight,
      selectQuestion,
      isTitleContainerSelected,
      selectTitleContainer,
      changeQuestionType,
      addNewQuestion,
      copyQuestion,
      updateQuestion,
      deleteQuestion,
      getQuestionComponent,
      openPeriodModal,
      closePeriodModal,
      confirmPeriod,
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
      getDateTime,
      showTitleError,
      questionErrors,
      openPreview,
      validateAndSave,
    };
  },
};
</script>

<style scoped>
.survey-create {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 10px 20px 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.header h2 {
  font-size: 1.25em;
  font-weight: 700;
  margin: 0; /* 기존 margin-bottom 제거 */
  padding: 0; /* 기존 padding-left 제거 */
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.preview-btn,
.save-btn {
  padding: 8px 20px;
  border-radius: 28.42px;
  border: none;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 5px;
}

.preview-btn {
  background: #EFEFEF;
  color: #000;
}

.save-btn {
  background: #BFD0E0;
  color: #000;
}

.create-container {
  width: 95%;
  min-height: 100%;
  background-color: #f7f9fb;
  border-radius: 30px;
  padding: 20px;
}

.content-area {
  display: flex;
  justify-content: center;
  min-height: 100%;
  position: relative;
}

.survey-container {
  width: 60%;
  height: 100%;
  min-height: 100vh;
  display: block;
  margin-right: 100px; /* side-container의 너비만큼 여백 추가 */
  position: relative;
}

.side-container {
  width: 120px;
  position: absolute;
  left: 75%;
  top: 20px;
  height: fit-content;
  transition: transform 0.3s ease;
  z-index: 100;
}

.title-container {
  width: 90%;
  min-height: 20%;
  background-color: #ffffff;
  border-radius: 23.38px;
  margin-top: 30px;
  padding: 20px;
}

.question-container {
  width: 90%;
  min-height: 20%;
  background-color: #ffffff;
  border-radius: 23.38px;
  margin-top: 15px;
  padding: 20px;
  transition: all 0.3s ease;
}

.question-container.selected {
  box-shadow: 0 0 0 2px #bfd0e0;
}

.input-wrapper {
  position: relative;
  margin-bottom: 5px;
}

textarea {
  margin-top: 10px;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 4px 0 0 0;
  resize: none;
  overflow: hidden;
  display: block;
  font-family: Pretendard;
}

.title-input {
  font-size: 25px;
  font-weight: 700;
}

.description-input {
  font-size: 16px;
}

.underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: transparent;
  transition: 0.2s ease;
}

.input-wrapper:not(:focus-within):hover .underline {
  background: rgba(191, 208, 224, 0.4);
}

.underline.focused {
  background: #bfd0e0;
  height: 1px;
}

/* 설문 기간 관련 스타일 */
.survey-period {
  margin-top: 25px;
}

.period-select {
  position: relative;
  cursor: pointer;
  padding: 8px 30px;
  background-color: #f7f9fb;
  border-radius: 23.38px;
  width: fit-content;
  color: #000;
  font-family: Pretendard;
  font-weight: bold;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-icon {
  width: 16px;
  height: 16px;
}

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
  width: 90%;
  max-width: 250px;
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

.time-item.disabled {
  color: #ccc;
  opacity: 0.5;
  cursor: not-allowed;
}

.time-item.disabled:hover {
  background: none;
}

.time-divider {
  font-size: 20px;
  font-weight: bold;
  color: #666;
}

/* v-calendar 커스텀 스타일 */
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

/* 새로운 에러 관련 스타일 */
.input-with-icon.error input {
  border: 1px solid #ff6b6b;
}

.end-time-error {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 5px;
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 10px;
  padding-left: 5px;
}

.title-container.error {
  box-shadow: 0 0 0 2px #ff6b6b;
}

.question-container.error {
  box-shadow: 0 0 0 2px #ff6b6b;
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
</style>