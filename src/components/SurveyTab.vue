<!-- 
  Author: 이새롬
  Description: 설문조사 질문 탭 컴포넌트 
  - 설문조사 데이터를 로드하여 제목, 설명, 기간, 질문, 응답 렌더링
  - 질문 유형(단일 선택, 다중 선택, 단답형, 장문형)에 따라 동적 렌더링
-->

<template>
    <div class="survey-tab">
        <div v-if="surveyData" class="preview-container">
            <!-- 설문 제목 영역은 동일 -->
            <div class="title-section">
                <h1 class="survey-title">{{ surveyData.title }}</h1>
                <p class="survey-description">{{ surveyData.description }}</p>
                <div class="survey-period">
                    <div class="period-display">
                        {{ formatDateTime(surveyData.startAt) }} ~ {{ formatDateTime(surveyData.endAt) }}
                    </div>
                </div>
            </div>
            <div class="required-notice">* 필수 질문</div>

            <!-- 질문 영역 -->
            <div class="questions-section">
                <div v-for="(question, index) in surveyData.question" :key="index" class="question-item">
                    <div class="question-header">
                        <span v-if="question.required" class="required-mark">*</span>
                        <span class="question-number">{{ index + 1 }}. </span>
                        <span class="question-title">{{ question.title }}</span>
                    </div>

                    <!-- 객관식 단일 선택 -->
                    <div v-if="question.questionType === 'SINGLE_CHOICE'" class="options-container">
                        <div v-for="(option, optIndex) in question.columns?.split('|`|')" :key="optIndex"
                            class="option-item">
                            <input type="radio" :name="'question-' + index" :id="'option-' + index + '-' + optIndex"
                                :value="optIndex" v-model="answers[index].selectedOption">
                            <label :for="'option-' + index + '-' + optIndex">{{ option }}</label>
                        </div>
                        <!-- 기타 옵션 (etc가 true일 때만 표시) -->
                        <template v-if="question.etc">
                            <div class="option-item">
                                <input type="radio" :name="'question-' + index" :id="'option-' + index + '-other'"
                                    value="other" v-model="answers[index].selectedOption">
                                <label :for="'option-' + index + '-other'">기타...</label>
                            </div>
                            <!-- 기타 텍스트 입력 -->
                            <div v-if="answers[index].selectedOption === 'other'" class="other-input-container">
                                <div class="input-wrapper">
                                    <textarea v-model="answers[index].otherText" placeholder="기타 내용을 입력해주세요"
                                        class="other-input" rows="1" @input="adjustHeight"></textarea>
                                    <div class="underline"></div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- 객관식 다중 선택 -->
                    <div v-else-if="question.questionType === 'MULTIPLE_CHOICE'" class="options-container">
                        <div v-for="(option, optIndex) in question.columns?.split('|`|')" :key="optIndex"
                            class="option-item">
                            <input type="checkbox" :id="'option-' + index + '-' + optIndex" :value="optIndex"
                                v-model="answers[index].selectedOptions">
                            <label :for="'option-' + index + '-' + optIndex">{{ option }}</label>
                        </div>
                        <!-- 기타 옵션 (etc가 true일 때만 표시) -->
                        <template v-if="question.etc">
                            <div class="option-item">
                                <input type="checkbox" :id="'option-' + index + '-other'" value="other"
                                    v-model="answers[index].hasOther">
                                <label :for="'option-' + index + '-other'">기타...</label>
                            </div>
                            <!-- 기타 텍스트 입력 -->
                            <div v-if="answers[index].hasOther" class="other-input-container">
                                <div class="input-wrapper">
                                    <textarea v-model="answers[index].otherText" placeholder="기타 내용을 입력해주세요"
                                        class="other-input" rows="1" @input="adjustHeight"></textarea>
                                    <div class="underline"></div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- 주관식 답변들은 동일 -->
                    <div v-else-if="question.questionType === 'SHORT_ANSWER'" class="text-answer">
                        <input type="text" placeholder="답변을 입력하세요 (최대 100자)" class="short-answer-input" maxlength="100"
                            v-model="answers[index].text">
                    </div>

                    <div v-else-if="question.questionType === 'LONG_ANSWER'" class="text-answer">
                        <textarea placeholder="답변을 입력하세요 (최대 2000자)" class="long-answer-input" maxlength="2000"
                            v-model="answers[index].text"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="loading-message">
            설문 데이터를 불러오는 중...
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { surveyAPI } from '@/service/surveyService';

export default {
    name: "SurveyTab",
    setup() {
        const route = useRoute();
        const surveyData = ref(null);
        const answers = ref([]);

        const formatDateTime = (dateTimeStr) => {
            const date = new Date(dateTimeStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? '오후' : '오전';
            const formattedHours = hours % 12 || 12;

            return `${year}-${month}-${day} ${ampm} ${formattedHours}:${minutes}`;
        };

        const adjustHeight = (e) => {
            const textarea = e.target;
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };

        const initializeAnswer = (questionType) => {
            switch (questionType) {
                case 'SINGLE_CHOICE':
                    return { selectedOption: null, otherText: '' };  // '' 대신 null
                case 'MULTIPLE_CHOICE':
                    return { selectedOptions: [], hasOther: false, otherText: '' };
                case 'SHORT_ANSWER':
                case 'LONG_ANSWER':
                    return { text: '' };
                default:
                    return {};
            }
        };

        const fetchSurveyData = async () => {
            try {
                const response = await surveyAPI.getSurveyDetail(route.params.id);
                if (response.data.success) {
                    surveyData.value = response.data.body;
                    // 답변 배열 초기화
                    answers.value = surveyData.value.question.map(q => initializeAnswer(q.questionType));
                }
            } catch (error) {
                console.error('설문 데이터 로드 실패:', error);
            }
        };

        onMounted(() => {
            fetchSurveyData();
        });

        return {
            surveyData,
            answers,
            formatDateTime,
            adjustHeight
        };
    }
};
</script>

<style scoped>
.survey-tab {
    padding: 20px;
    background-color: #f7f9fb;
    border-radius: 10px;
    height: 100%;
    overflow-y: auto;
    margin-bottom: 10px;
}

.survey-tab::-webkit-scrollbar {
    display: none;
}

.preview-container {
    max-width: 800px;
    margin: 0 auto;
}

.title-section {
    background: white;
    border-radius: 23.38px;
    padding: 30px;
    margin-bottom: 10px;
}

.survey-title {
    font-size: 25px;
    font-weight: 700;
    margin-bottom: 15px;
}

.survey-description {
    font-size: 16px;
    margin-bottom: 20px;
    color: #666;
}

.period-display {
    padding: 8px 30px;
    background-color: #f7f9fb;
    border-radius: 23.38px;
    width: fit-content;
    color: #000;
    font-weight: bold;
    font-size: 13px;
}

.required-notice {
    text-align: right;
    color: #ff6b6b;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    margin-right: 20px;
}

.question-item {
    background: white;
    border-radius: 23.38px;
    padding: 30px;
    margin-bottom: 15px;
}

.question-header {
    margin-bottom: 20px;
}

.required-mark {
    color: #ff6b6b;
    font-weight: bold;
    margin-right: 4px;
}

.question-number {
    font-weight: 600;
}

.question-title {
    font-weight: 600;
}

.options-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.option-item {
    display: flex;
    align-items: center;
    /* flex-start에서 center로 변경 */
    gap: 8px;
}

.option-item input[type="radio"],
.option-item input[type="checkbox"] {
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    margin: 0;
    /* margin-top 제거 */
    accent-color: steelblue;
    flex-shrink: 0;
}

.option-item label {
    word-break: break-all;
    line-height: 1.4;
    display: flex;
    /* 레이블도 flex로 */
    align-items: center;
    /* 레이블 내용 중앙 정렬 */
}

.text-answer input,
.text-answer textarea {
    width: 95%;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 8px;
    outline: none;
    background-color: #f9f9f9;
    font-family: inherit;
}

.short-answer-input {
    height: 40px;
}

.long-answer-input {
    height: 120px;
    resize: none;
}

.other-input-container {
    margin-top: 8px;
    margin-left: 24px;
    width: calc(100% - 24px);
}

.other-input-container .input-wrapper {
    position: relative;
    width: 100%;
}

.other-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 14px;
    resize: none;
    overflow: hidden;
}

.other-input-container .underline {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: #eee;
    transition: background 0.2s ease;
}

.other-input:focus+.underline {
    background: steelblue;
}

.input-wrapper:hover .underline {
    background: rgba(70, 130, 180, 0.4);
}

.loading-message {
    text-align: center;
    padding: 40px;
    color: #666;
}

@media (max-width: 768px) {
    .preview-container {
        padding: 10px;
    }

    .title-section,
    .question-item {
        padding: 20px;
    }

    .survey-title {
        font-size: 20px;
    }
}
</style>
