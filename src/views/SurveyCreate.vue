<template>
  <div class="survey-create">
    <div class="header">
      <BackButton />

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
          <div class="title-container" @click="selectTitleContainer" :class="{ error: showTitleError || showPeriodError, selected: isTitleContainerSelected }">
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
                  src="@/assets/images/edit_date.svg"
                  alt="달력"
                  class="calendar-icon"
                />
                {{ formattedPeriod }}
              </div>
            </div>
            <div v-if="showTitleError || showPeriodError" class="error-message">
              설문 제목 및 기간을 모두 입력해주세요.
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
                  {{ getErrorMessage(question.type) }}
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

    <!-- 설문 기간 선택 컴포넌트 -->
    <PeriodModalComponent
      v-if="showPeriodModal"
      :show-period-modal="showPeriodModal"
      :initial-start-date="startDate"
      :initial-start-time="startTime"
      :initial-end-date="endDate"
      :initial-end-time="endTime"
      @cancel="closePeriodModal"
      @confirm="confirmPeriod"
    />
  </div>
</template>

<script>
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from "vue";
import { debounce } from 'lodash';
import BackButton from "../components/BackButton.vue";
import QuestionTypeTab from "@/components/QuestionTypeTab.vue";
import SingleChoiceQuestion from "@/components/SingleChoiceQuestion.vue";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion.vue";
import ShortAnswerQuestion from "@/components/ShortAnswerQuestion.vue";
import LongAnswerQuestion from "@/components/DescriptiveAnswerQuestion.vue";
import PeriodModalComponent from "@/components/PeriodModalComponent.vue";
import { showConfirmAlert, showErrorAlert } from '@/utils/swalUtils';
import { surveyAPI } from '@/service/surveyService';

export default {
  name: 'SurveyCreate',

  components: {
    BackButton,
    PeriodModalComponent,
    QuestionTypeTab,
    SingleChoiceQuestion,
    MultipleChoiceQuestion,
    ShortAnswerQuestion,
    LongAnswerQuestion,
  },

  setup() {
    const router = useRouter();
    const hasUnsavedChanges = ref(false);
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
    const showPeriodError = ref(false);

    // Period modal state
    const showPeriodModal = ref(false);
    const startDate = ref("");
    const startTime = ref("");
    const endDate = ref("");
    const endTime = ref("");

    const isTitleContainerSelected = ref(true);

    // Question data
    const selectedQuestionIndex = ref(null);
    const sideTabTop = ref(0);
    const questions = ref([
      {
        id: Date.now(),
        type: "single",
        title: "",
        required: false,
      },
    ]);

    // Computed
    const formattedPeriod = computed(() => {
      if (!startDate.value || !endDate.value) {
        return "시작 날짜 ~ 종료 날짜";
      }
      return `${startDate.value} ${startTime.value ? formatDisplayTime(startTime.value) : ''} ~ ${endDate.value} ${endTime.value ? formatDisplayTime(endTime.value) : ''}`;
    });

    const formatDisplayTime = (time) => {
      if (!time) return "";
      const [hours, minutes] = time.split(":").map(Number);
      const ampm = hours < 12 ? "오전" : "오후";
      const hour = hours % 12 || 12;
      return `${ampm} ${hour}:${minutes.toString().padStart(2, "0")}`;
    };

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

    const updateSideTabPosition = () => {
      const scrollContainer = createContainer.value;
      if (!scrollContainer) return;
      
      let targetElement;
      
      if (isTitleContainerSelected.value) {
        targetElement = scrollContainer.querySelector('.title-container');
      } else if (selectedQuestionIndex.value !== null && 
                questionContainer.value[selectedQuestionIndex.value]) {
        targetElement = questionContainer.value[selectedQuestionIndex.value];
      }
      
      if (targetElement) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = targetElement.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop;
        
        // 질문 컨테이너와 수평을 맞추기 위한 오프셋 계산
        const offset = 20; // 질문 컨테이너와의 간격
        const relativeTop = elementRect.top - containerRect.top + scrollTop - offset;
        const maxTop = scrollContainer.scrollHeight - 300;
        
        sideTabTop.value = Math.min(Math.max(0, relativeTop), maxTop);
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
      
      const containerElement = createContainer.value;
      if (!containerElement) return;
      
      const titleContainer = containerElement.querySelector('.title-container');
      if (titleContainer) {
        const containerRect = containerElement.getBoundingClientRect();
        const rect = titleContainer.getBoundingClientRect();
        sideTabTop.value = rect.top - containerRect.top;
        
        containerElement.scrollTo({
          top: titleContainer.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    };

    const selectQuestion = (index) => {
      selectedQuestionIndex.value = index;
      isTitleContainerSelected.value = false;
      
      if (questionContainer.value[index] && createContainer.value) {
        const element = questionContainer.value[index];
        const containerElement = createContainer.value;
        containerElement.scrollTo({
          top: element.offsetTop - 20,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          updateSideTabPosition();
        }, 0);
      }
    };

    const changeQuestionType = (newType) => {
      if (selectedQuestionIndex.value !== null) {
        questions.value[selectedQuestionIndex.value] = {
          ...questions.value[selectedQuestionIndex.value],
          type: newType,
        };
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
        : 0;

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
      const newIndex = index > 0 ? index - 1 : 0;
      
      questions.value.splice(index, 1);
      
      if (questions.value.length === 0) {
        addNewQuestion();
      } else {
        setTimeout(() => {
          nextTick(() => {
            selectQuestion(newIndex);
          });
        }, 0);
      }
    };

    const getQuestionComponent = (type) => {
      const components = {
        single: "SingleChoiceQuestion",
        multiple: "MultipleChoiceQuestion",
        short: "ShortAnswerQuestion",
        long: "LongAnswerQuestion",
      };
      return components[type] || components.single;
    };

    // Period related methods
    const openPeriodModal = () => {
      showPeriodModal.value = true;
    };

    const closePeriodModal = () => {
      showPeriodModal.value = false;
    };

    const confirmPeriod = ({ startDate: newStartDate, endDate: newEndDate, startTime: newStartTime, endTime: newEndTime }) => {
      startDate.value = newStartDate;
      startTime.value = newStartTime;
      endDate.value = newEndDate;
      endTime.value = newEndTime;
      showPeriodModal.value = false;
    };

    const openPreview = () => {
      const previewData = {
        title: title.value,
        description: description.value,
        startDate: startDate.value,
        startTime: startTime.value,
        endDate: endDate.value,
        endTime: endTime.value,
        questions: questions.value
      };

      sessionStorage.setItem('surveyPreviewData', JSON.stringify(previewData));
      const route = router.resolve({ name: 'SurveyPreview' });
      window.open(route.href, '_blank');
    };

    const getErrorMessage = (type) => {
      switch(type) {
        case 'single':
        case 'multiple':
          return '질문 및 옵션을 모두 입력해주세요.';
        case 'short':
        case 'long':
          return '질문을 입력해주세요.';
        default:
          return '질문을 입력해주세요.';
      }
    };

    const validateAndSave = () => {
      let isValid = true;
      
      showTitleError.value = !title.value.trim();
      showPeriodError.value = !startDate.value || !startTime.value || !endDate.value || !endTime.value;
      
      if (showTitleError.value || showPeriodError.value) {
        isValid = false;
      }

      questionErrors.value = {};
      questions.value.forEach((question, index) => {
        let hasError = false;
        
        if (!question.title.trim()) {
          hasError = true;
        }

        if (question.type === 'single' || question.type === 'multiple') {
          if (!question.options || question.options.length === 0 || 
              question.options.some(opt => !opt.text.trim())) {
            hasError = true;
          }
        }

        if (hasError) {
          questionErrors.value[index] = true;
          isValid = false;
        }
      });

      if (!isValid) {
        const containerElement = createContainer.value;
        if (!containerElement) return;

        if (showTitleError.value || showPeriodError.value) {
          const titleElement = containerElement.querySelector('.title-container');
          if (titleElement) {
            // 컨테이너 내부에서의 스크롤 처리
            containerElement.scrollTo({
              top: titleElement.offsetTop - 20,
              behavior: 'smooth'
            });
          }
        } else {
          const firstErrorIndex = Object.keys(questionErrors.value)[0];
          if (firstErrorIndex !== undefined) {
            const questionElement = questionContainer.value[firstErrorIndex];
            if (questionElement) {
              // 컨테이너 내부에서의 스크롤 처리
              containerElement.scrollTo({
                top: questionElement.offsetTop - 20,
                behavior: 'smooth'
              });
            }
          }
        }
        return;
      }

      saveSurvey();
    };

    const saveSurvey = async () => {
    try {
      const formatDateTime = (date, time) => {
        if (!date || !time) return null;
        const [year, month, day] = date.split('. ');
        const [timeStr, period] = time.split(' ');
        const [hour, minute] = timeStr.split(':');
        
        let hour24 = parseInt(hour);
        if (period === '오후' && hour24 !== 12) hour24 += 12;
        if (period === '오전' && hour24 === 12) hour24 = 0;
        
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour24.toString().padStart(2, '0')}:${minute}:00`;
      };

      const formatQuestions = (questions) => {
        return questions.map((q, index) => {
          const questionType = {
            'single': 'SINGLE_CHOICE',
            'multiple': 'MULTIPLE_CHOICE',
            'short': 'SHORT_ANSWER',
            'long': 'LONG_ANSWER'
          }[q.type];

          const hasOtherOption = q.options ? q.options.some(opt => opt.isOther) : false;

          let columns = null;
          if (q.options) {
            // isOther가 true가 아닌 옵션들만 columns에 포함
            columns = q.options
              .filter(opt => !opt.isOther)
              .map(opt => opt.text)
              .join('|`| ');
          }

          return {
            title: q.title,
            questionType,
            order: index + 1,
            columns,
            rows: null,
            required: q.required,
            etc: hasOtherOption
          };
        });
      };

      const surveyData = {
        title: title.value,
        description: description.value,
        startAt: formatDateTime(startDate.value, startTime.value),
        endAt: formatDateTime(endDate.value, endTime.value),
        questions: formatQuestions(questions.value)
      };

      await surveyAPI.createSurvey(surveyData);
      hasUnsavedChanges.value = false;
      router.push({ name: "SurveyCompletion" });
    } catch (error) {
      console.error('설문 저장 실패:', error);
      showErrorAlert( "설문조사 생성 실패", "설문조사 생성 중 오류가 발생했습니다." );
    }
  };

    onBeforeRouteLeave((to, from, next) => {
      if (!hasUnsavedChanges.value) {
        next();
        return;
      }

      showConfirmAlert({
        html: '정말로 나가시겠습니까?',
        subMessage: '* 작성 중인 내용이 저장되지 않습니다.',
        confirmText: '나가기',
        cancelText: '취소',
        onConfirm: () => {
          next();
        },
        onCancel: () => {
          next(false);
        }
      });
    });

    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges.value) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    onMounted(() => {
      nextTick(() => {
        selectTitleContainer();
        updateSideTabPosition();
        window.addEventListener("resize", debouncedUpdatePosition);
        if (createContainer.value) {
          createContainer.value.addEventListener("scroll", debouncedUpdatePosition);
        }
        window.addEventListener('beforeunload', handleBeforeUnload);
      });

      watch([title, description], () => {
        hasUnsavedChanges.value = true;
      });

      watch(questions, () => {
        hasUnsavedChanges.value = true;
      }, { deep: true });

      watch([startDate, startTime, endDate, endTime], () => {
        hasUnsavedChanges.value = true;
      });

      // 제목과 기간 입력 감시
      watch([title, startDate, startTime, endDate, endTime], () => {
        hasUnsavedChanges.value = true;
        
        // 에러 상태 실시간 업데이트
        if (showTitleError.value || showPeriodError.value) {
          showTitleError.value = !title.value.trim();
          showPeriodError.value = !startDate.value || !startTime.value || !endDate.value || !endTime.value;
        }
      });

      // 질문 입력 감시
      watch(questions, (newQuestions) => {
        hasUnsavedChanges.value = true;
        // 에러가 있는 질문들만 실시간 검사
        Object.keys(questionErrors.value).forEach(index => {
          if (questionErrors.value[index]) {
            const question = newQuestions[index];
            let hasError = false;
            
            if (!question.title.trim()) {
              hasError = true;
            }

            if (question.type === 'single' || question.type === 'multiple') {
              if (!question.options || question.options.length === 0 || 
                  question.options.some(opt => !opt.text.trim())) {
                hasError = true;
              }
            }

            // 에러가 해결되었다면 해당 질문의 에러 상태 제거
            if (!hasError) {
              delete questionErrors.value[index];
            }
          }
        });
      }, { deep: true });
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", debouncedUpdatePosition);
      if (createContainer.value) {
        createContainer.value.removeEventListener("scroll", debouncedUpdatePosition);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });

    return {
      createContainer,
      questionContainer,
      title,
      description,
      titleFocused,
      descFocused,
      showPeriodModal,
      selectedQuestionIndex,
      sideTabTop,
      questions,
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
      openPreview,
      validateAndSave,
      showTitleError,
      questionErrors,
      hasUnsavedChanges,
      showPeriodError,
      startDate,
      startTime,
      endDate,
      endTime,
      formatDisplayTime,
      getErrorMessage
    };
  },
};

</script>

<style scoped>
.survey-create {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 10px 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 10px 0 4px;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header h2 {
  font-size: 1.25em;
  font-weight: 700;
  margin: 0;
  padding: 0 0 0 30px;
  flex: 1; 
  text-align: left; 
}

.header-buttons {
  display: flex;
  gap: 10px;
  padding-bottom: 5px;
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
  width: 100%;
  background-color: #f7f9fb;
  border-radius: 30px;
  padding: 20px;
  margin-bottom: 20px;
  overflow-y: auto;
  min-height: 80vh;
}

.content-area {
  display: flex;
  justify-content: center;
  position: relative;
}

.survey-container {
  width: 60%;
  height: 100%;
  display: block;
  margin-right: 100px;
  position: relative;
}

.side-container {
  width: 120px;
  position: absolute;
  left: 73%;
  top: 20px;
  height: fit-content;
  transition: transform 0.3s ease;
  z-index: 100;
}

.title-container {
  width: 95%;
  min-height: 20%;
  background-color: #ffffff;
  border-radius: 23.38px;
  margin-top: 30px;
  padding: 20px;
}

.question-container {
  width: 95%;
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

.title-container.selected {
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