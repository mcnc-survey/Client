<template>
    <div class="stats-section">
        <div v-if="loading" class="loading-container">
            <p>데이터를 불러오는 중...</p>
        </div>
        <div v-else-if="error" class="error-container">
            <p>{{ error }}</p>
        </div>

        <!-- 상단 통계 카드 -->
        <div v-else class="info-cards-container">
            <div class="info-card respondent-card">
                <h3>응답자 수</h3>
                <p>{{ surveySummary.respondentCount }}명</p>
            </div>
            <div class="info-card remaining-time-card">
                <h3>설문 종료까지</h3>
                <p>{{ remainingTime }}</p>
            </div>
            <div class="info-card last-modified-card">
                <h3>최근 수정일</h3>
                <p>{{ surveySummary.lastModifiedDate }}</p>
            </div>
            <div class="share-buttons-container">
                <button class="share-button download-excel" @click="downloadExcel">
                    <img src="../assets/images/excel.svg" class="excel-icon">응답 데이터 엑셀로 다운로드</button>
                <button class="share-button download-pdf" @click="downloadPDF">
                    <img src="../assets/images/pdf.svg" class="pdf-icon">응답 데이터 pdf로 다운로드</button>
            </div>
        </div>

        <!-- 문항별 통계 -->
        <div v-if="!loading && !error" class="questions-stats-container">
            <QuestionStats v-for="(question, id) in surveyResults" :key="id" :question="question" />
        </div>
    </div>
</template>

<script>
import QuestionStats from "../components/QuestionsStats.vue";
import { surveyAPI } from '@/service/surveyService';
import { useRoute } from 'vue-router';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
    name: "StatsTab",
    components: {
        QuestionStats,
    },
    props: {
        surveyId: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            surveySummary: {},
            surveyResults: {},
            loading: true,
            error: null,
        };
    },
    computed: {
        remainingTime() {
            if (!this.surveySummary.endDate) return "종료됨";
            const now = new Date();
            const endDate = new Date(this.surveySummary.endDate);
            const diff = endDate - now;
            if (diff <= 0) return "종료됨";
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            return `${days}일 ${hours}시간`;
        },
    },
    methods: {
        async fetchSurveyResults() {
            const route = useRoute();

            try {
                this.loading = true;
                const response = await surveyAPI.getSurveyStats(route.params.id);

                if (response.data.resultCode === "200") {
                    this.surveySummary = response.data.body.surveySummary;
                    this.surveyResults = response.data.body.surveyResults || {};

                } else {
                    throw new Error('데이터를 불러오는 데 실패했습니다.');
                }
            } catch (error) {
                this.error = error.response?.data?.message || error.message || '데이터를 불러오는 중 오류가 발생했습니다.';
                console.error('API 호출 오류:', error);
            } finally {
                this.loading = false;
            }
        },

        downloadExcel() {
            try {
                const workbook = XLSX.utils.book_new();

                const surveyTitle = this.surveySummary.title || '설문조사';
                const sanitizedFileName = surveyTitle.replace(/[\\/\\?%*:|"<>]/g, '_');

                // Survey Summary Sheet 추가
                const summaryData = [
                    ['응답자 수', '설문 종료 날짜', '최근 수정일'],
                    [
                        this.surveySummary.respondentCount || 'N/A',
                        this.surveySummary.endDate || 'N/A',
                        this.surveySummary.lastModifiedDate || 'N/A'
                    ]
                ];
                const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

                // 셀 너비 조정
                summarySheet['!cols'] = [
                    { wch: 15 }, // 첫 번째 열 너비
                    { wch: 20 }, // 두 번째 열 너비
                    { wch: 25 }  // 세 번째 열 너비
                ];

                XLSX.utils.book_append_sheet(workbook, summarySheet, 'Survey Summary');

                // Survey Results (각 질문) Sheet 추가
                if (Object.keys(this.surveyResults).length > 0) {
                    Object.values(this.surveyResults).forEach((question, index) => {
                        const questionData = [
                            ['질문 제목', question.questionTitle || ''],
                            ['질문 유형', question.questionType || ''],
                            ['전체 응답 수', question.totalResponseCount || 0],
                            [], // 빈 줄
                            ['응답 내용', '응답 수']
                        ];

                        // 응답 내용 추가
                        (question.responses || []).forEach(response => {
                            questionData.push([response.text || '', response.count || 0]);
                        });

                        const questionSheet = XLSX.utils.aoa_to_sheet(questionData);

                        // 셀 너비 조정
                        questionSheet['!cols'] = [
                            { wch: 40 }, // 응답 내용 (긴 텍스트 고려)
                            { wch: 15 }  // 응답 수
                        ];

                        XLSX.utils.book_append_sheet(workbook, questionSheet, `Question ${index + 1}`);
                    });
                } else {
                    const noDataSheet = XLSX.utils.aoa_to_sheet([['데이터 없음']]);
                    noDataSheet['!cols'] = [{ wch: 20 }]; // 너비 설정
                    XLSX.utils.book_append_sheet(workbook, noDataSheet, 'No Data');
                }

                // Excel 파일 다운로드
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${sanitizedFileName}.xlsx`;
                a.click();
                URL.revokeObjectURL(url);

            } catch (error) {
                console.error('엑셀 생성 오류:', error);
                alert('엑셀 파일을 생성하는 중 오류가 발생했습니다.');
            }
        },

        async downloadPDF() {
            try {
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'a4'
                });

                const element = this.$el.querySelector('.questions-stats-container');
                const margin = 10;
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const contentWidth = pageWidth - (2 * margin);

                // 각 질문 통계를 개별적으로 처리
                const questionElements = element.querySelectorAll('.question-stats');
                let yPosition = margin;

                for (const questionEl of questionElements) {
                    const canvas = await html2canvas(questionEl, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        // windowWidth 옵션 제거
                        width: questionEl.scrollWidth, // 요소의 실제 너비 사용
                        height: questionEl.scrollHeight // 요소의 실제 높이 사용
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const aspectRatio = canvas.height / canvas.width;
                    const imgWidth = contentWidth;
                    const imgHeight = contentWidth * aspectRatio;

                    // 현재 페이지에 충분한 공간이 없으면 새 페이지 추가
                    if (yPosition + imgHeight > pageHeight - margin) {
                        pdf.addPage();
                        yPosition = margin;
                    }

                    // 이미지 추가
                    pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
                    yPosition += imgHeight + 10; // 질문 사이 여백 추가
                }

                const sanitizedFileName = (this.surveySummary.title || '설문조사').replace(/[\\/\\?%*:|"<>]/g, '_');
                pdf.save(`${sanitizedFileName}.pdf`);

            } catch (error) {
                console.error('PDF 생성 오류:', error);
                alert('PDF 파일을 생성하는 중 오류가 발생했습니다.');
            }
        }
    },
    created() {
        this.fetchSurveyResults();
    }
};
</script>

<style scoped>
.stats-section {
    font-family: Pretendard;
    overflow-y: auto;
    height: 100%;
}

.stats-section::-webkit-scrollbar {
    display: none;
}

/* 상단 카드 스타일 */
.info-cards-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
}

.info-card {
    flex: 1;
    height: 115px;
    border-radius: 16px;
    padding: 5px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 290px;
}

.info-card h3 {
    margin: 0 24px 8px;
    font-size: 16px;
}

.info-card p {
    margin: 0 24px;
    font-size: 24px;
    font-weight: bold;
}

.respondent-card {
    background-color: #E3F5FF;
}

.remaining-time-card {
    background-color: #E5ECF6;
}

.last-modified-card {
    background-color: #D3E2EC;
}

.share-buttons-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 28%;
}

.share-button {
    font-family: Pretendard;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    height: 50px;
    padding: 10px 20px;
    border: none;
    border-radius: 12.5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
}

.share-button img {
    width: 24px;
    height: 24px;
}

.download-excel {
    background: #C5ECD2;
}

.download-pdf {
    background: #FDD4D3;
}

/* 문항별 통계 컨테이너 */
.questions-stats-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
}
</style>