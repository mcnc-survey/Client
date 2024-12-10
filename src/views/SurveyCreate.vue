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
          <div class="title-container" @click="selectTitleContainer" :class="{ error: showTitleError, selected: isTitleContainerSelected }">
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

    <!-- 설문 기간 선택 컴포넌트 -->
    <PeriodModalComponent
      v-model="showPeriodModal"
      v-model:startDateTime="startDateTime"
      v-model:endDateTime="endDateTime"
      :show-error="showError"
      @cancel="closePeriodModal"
      @confirm="confirmPeriod"
    />
  </div>
</template>

<script>
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from "vue";
import { debounce } from 'lodash';
import QuestionTypeTab from "@/components/QuestionTypeTab.vue";
import SingleChoiceQuestion from "@/components/SingleChoiceQuestion.vue";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion.vue";
import GridQuestion from "@/components/GridQuestion.vue";
import ShortAnswerQuestion from "@/components/ShortAnswerQuestion.vue";
import LongAnswerQuestion from "@/components/DescriptiveAnswerQuestion.vue";
import PeriodModalComponent from "@/components/PeriodModalComponent.vue";
import { showConfirmAlert } from '@/utils/swalUtils';

export default {
  components: {
    PeriodModalComponent,
    QuestionTypeTab,
    SingleChoiceQuestion,
    MultipleChoiceQuestion,
    GridQuestion,
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

    // Period modal state
    const showPeriodModal = ref(false);
    const startDateTime = ref(null);
    const endDateTime = ref(null);
    const showError = ref(false);

    const isTitleContainerSelected = ref(false);

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

    // Computed
    const formattedPeriod = computed(() => {
      if (!startDateTime.value && !endDateTime.value) {
        return "시작 날짜 ~ 종료 날짜";
      }
      return formatDateTime(startDateTime.value) + " ~ " + formatDateTime(endDateTime.value);
    });

    // Methods
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
      if (selectedQuestionIndex.value !== null && 
          questionContainer.value[selectedQuestionIndex.value]) {
        const selectedElement = questionContainer.value[selectedQuestionIndex.value];
        const containerRect = createContainer.value.getBoundingClientRect();
        const titleContainer = document.querySelector('.title-container');
        const rect = selectedElement.getBoundingClientRect();
        const minTop = titleContainer.getBoundingClientRect().top - containerRect.top;
        const maxTop = containerRect.height - 300;
        const relativeTop = rect.top - containerRect.top;
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
      return components[type];
    };

    // Period related methods
    const openPeriodModal = () => {
      showPeriodModal.value = true;
    };

    const closePeriodModal = () => {
      showError.value = false;
      showPeriodModal.value = false;
    };

    const confirmPeriod = ({ startDateTime: start, endDateTime: end }) => {
      startDateTime.value = start;
      endDateTime.value = end;
      showPeriodModal.value = false;
    };

    const openPreview = () => {
      const previewData = {
        title: title.value,
        description: description.value,
        startDateTime: startDateTime.value,
        endDateTime: endDateTime.value,
        questions: questions.value
      };

      sessionStorage.setItem('surveyPreviewData', JSON.stringify(previewData));
      
      const route = router.resolve({ name: 'SurveyPreview' });
      window.open(route.href, '_blank');
    };

    const validateAndSave = () => {
      let isValid = true;
      
      showTitleError.value = !title.value.trim();
      if (showTitleError.value) {
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
        if (showTitleError.value) {
          document.querySelector('.title-container').scrollIntoView({ behavior: 'smooth' });
        } else {
          const firstErrorIndex = Object.keys(questionErrors.value)[0];
          questionContainer.value[firstErrorIndex]?.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      saveSurvey();
    };

    const saveSurvey = () => {
      hasUnsavedChanges.value = false;
      router.push({ name: "SurveyCompletion" }).catch((error) => {
        console.error("SurveyCompletion 페이지로 이동 실패:", error);
      });
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
        updateSideTabPosition();
        window.addEventListener("resize", debouncedUpdatePosition);
        window.addEventListener("scroll", debouncedUpdatePosition);
        window.addEventListener('beforeunload', handleBeforeUnload);
      });

      watch([title, description], () => {
        hasUnsavedChanges.value = true;
      });

      watch(questions, () => {
        hasUnsavedChanges.value = true;
      }, { deep: true });

      watch([startDateTime, endDateTime], () => {
        hasUnsavedChanges.value = true;
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", debouncedUpdatePosition);
      window.removeEventListener("scroll", debouncedUpdatePosition);
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
      startDateTime,
      endDateTime,
      showError,
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
      hasUnsavedChanges
    };
  },
};

</script>

<style scoped>
.survey-create {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  padding: 0;
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
  min-height: 100%;
  background-color: #f7f9fb;
  border-radius: 30px;
  padding: 20px;
  margin: 0 auto;
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