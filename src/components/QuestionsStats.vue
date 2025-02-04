<!--
  Author: 이새롬
  Description: 설문 질문 통계 및 응답 표시 컴포넌트
  - 객관식 질문에 대한 도넛 차트 및 막대 차트 전환 기능 제공
  - 주관식 질문에 대한 응답 목록 표시
  - 응답 수에 따라 차트 또는 응답 목록을 동적으로 렌더링
  - 기타 의견을 별도로 표시하는 섹션 제공
-->

<template>
    <div class="question-stats">
        <div class="question-header">
            <div class="title-section">
                <h4 class="question-title">{{ question.questionTitle }}</h4>
                <div v-if="shouldShowChartToggle" class="chart-toggle">
                    <button class="toggle-btn" :class="{ active: chartType === 'doughnut' }"
                        @click="handleChartTypeChange('doughnut')" :disabled="isChanging">
                        <span class="toggle-icon doughnut">◯</span>
                    </button>
                    <button class="toggle-btn" :class="{ active: chartType === 'bar' }"
                        @click="handleChartTypeChange('bar')" :disabled="isChanging">
                        <span class="toggle-icon bar">▌</span>
                    </button>
                </div>
            </div>
            <span class="total-responses">
                총 응답수: {{ question.totalResponseCount }}명
            </span>
        </div>

        <div class="stats-content">
            <!-- 객관식 응답 -->
            <template v-if="isChartableQuestion && hasResponses">
                <div class="chart-container">
                    <div v-show="chartType === 'doughnut'" class="chart-wrapper">
                        <canvas ref="doughnutCanvas"></canvas>
                    </div>
                    <div v-show="chartType === 'bar'" class="chart-wrapper">
                        <canvas ref="barCanvas"></canvas>
                    </div>
                </div>

                <div class="stats-details">
                    <div v-for="(option, index) in question.responses" :key="index" class="stat-item">
                        <div class="stat-label">
                            <span class="color-dot" :style="{ backgroundColor: chartColors[index] }"></span>
                            <span>{{ option.text }}</span>
                        </div>
                        <div class="stat-values">
                            <span class="stat-count">{{ option.count }}표</span>
                            <span class="stat-percentage">({{ calculatePercentage(option.count) }}%)</span>
                        </div>
                    </div>
                </div>
            </template>

            <!-- 주관식 응답 -->
            <template v-else-if="!isChartableQuestion && hasResponses">
                <div class="subjective-responses">
                    <div v-for="(response, index) in question.responses" :key="index" class="response-item">
                        <span class="response-number">{{ index + 1 }}</span>
                        <p class="response-text">{{ response }}</p>
                    </div>
                </div>
            </template>

            <!-- 응답 없음 -->
            <template v-else>
                <div class="no-responses">
                    <p>아직 응답이 없어요!</p>
                </div>
            </template>
        </div>

        <!-- 기타 응답 섹션 -->
        <div v-if="hasEtcResponses" class="etc-section">
            <div class="etc-header">
                <h5 class="section-title">기타 의견</h5>
            </div>
            <div class="subjective-responses">
                <div v-for="(response, index) in question.etc" :key="index" class="response-item">
                    <span class="response-number">{{ index + 1 }}</span>
                    <p class="response-text">{{ response }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Chart, DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

Chart.register(DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);

export default {
    name: 'QuestionStats',
    props: {
        question: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            chartType: 'doughnut',
            isChanging: false,
            chartColors: ['#95A4FC', '#BAEDBD', '#FFFDB5', '#B1E3FF', '#F9E2AF'],
            doughnutChart: null,
            barChart: null,
            responses: this.question.responses || [], // 주관식 질문 응답
        };
    },
    computed: {
        hasResponses() {
            return this.question.responses && this.question.responses.length > 0;
        },
        hasEtcResponses() {
            return this.question.etc && this.question.etc.length > 0;
        },
        isChartableQuestion() {
            return ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(this.question.questionType);
        },
        shouldShowChartToggle() {
            return this.isChartableQuestion && this.hasResponses;
        },
        responseResults() {
            // 데이터가 없을 때 빈 배열 반환
            return this.question.responses ? this.question.responses.map((response) => ({
                text: response.text,
                count: response.count,
            })) : [];
        },

        chartData() {
            if (!this.question.responses || this.question.responses.length === 0) {
                return { labels: [], datasets: [{ data: [], backgroundColor: [] }] };
            }

            const labels = this.question.responses.map((option) => option.text);
            const data = this.question.responses.map((option) => option.count);
            const colors = this.chartColors.slice(0, labels.length);

            if (this.chartType === "doughnut") {
                return {
                    labels: labels.reverse(),
                    datasets: [{
                        data: data.reverse(),
                        backgroundColor: colors.slice(0, labels.length).reverse(),
                    }],
                };
            }

            return {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors.slice(0, labels.length),
                }],
            };
        },
    },
    mounted() {
        if (this.question.questionType === 'SINGLE_CHOICE' || this.question.questionType === 'MULTIPLE_CHOICE') {
            this.$nextTick(() => {
                this.initializeCharts();
            });
        }
    },
    beforeUnmount() {
        this.destroyCharts();
    },
    methods: {
        calculatePercentage(value) {
            // responses 배열에서 count 값의 총합을 계산
            const total = this.question.responses
                ? this.question.responses.reduce((sum, response) => sum + response.count, 0)
                : 0;

            // 퍼센트를 계산하며, total이 0이면 0.0% 반환
            return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
        },

        async handleChartTypeChange(newType) {
            if (this.isChanging || this.chartType === newType) return;

            this.isChanging = true;
            this.chartType = newType;

            await this.$nextTick();
            this.updateCharts();

            setTimeout(() => {
                this.isChanging = false;
            }, 300);
        },
        getChartConfig(type) {
            const baseConfig = {
                type,
                data: this.chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 300,
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            displayColors: false,
                            callbacks: {
                                label: (context) => {
                                    // 차트 타입에 따라 인덱스 처리 다르게
                                    let dataIndex = context.dataIndex;

                                    // 도넛 그래프일 경우에만 역순 처리
                                    if (type === 'doughnut') {
                                        dataIndex = this.question.responses.length - 1 - context.dataIndex;
                                    }

                                    const value = this.question.responses[dataIndex].count;
                                    const percentage = this.calculatePercentage(value);

                                    return `${value}표 (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            };

            if (type === "doughnut") {
                baseConfig.options.cutout = '85%';
                baseConfig.data.datasets[0].borderWidth = 30;
                baseConfig.data.datasets[0].hoverBorderWidth = 30;
                baseConfig.data.datasets[0].borderRadius = 30;
                baseConfig.data.datasets[0].borderColor = baseConfig.data.datasets[0].backgroundColor;
            } else {
                baseConfig.data.datasets[0].borderWidth = 0;
                baseConfig.data.datasets[0].borderRadius = 15;
                baseConfig.options.scales = {
                    y: { grid: { display: false } },
                    x: { grid: { display: false }, beginAtZero: true },
                };
            }

            return baseConfig;
        },

        initializeCharts() {

            this.destroyCharts();

            const doughnutCtx = this.$refs.doughnutCanvas?.getContext('2d');
            const barCtx = this.$refs.barCanvas?.getContext('2d');

            console.log("차트 데이터:", this.chartData);

            if (doughnutCtx) {
                this.doughnutChart = new Chart(doughnutCtx, this.getChartConfig('doughnut'));
            }
            if (barCtx) {
                this.barChart = new Chart(barCtx, this.getChartConfig('bar'));
            }
        },

        updateCharts() {
            this.initializeCharts();
        },

        destroyCharts() {
            if (this.doughnutChart) this.doughnutChart.destroy();
            if (this.barChart) this.barChart.destroy();
        },

    },
    watch: {
        responseResults: {
            handler() {
                this.updateCharts();
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
.question-stats {
    padding: 35px 15px 35px 35px;
    border-radius: 16px;
    background-color: #F7F9FB;
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
}

.title-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.question-title {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
}

.total-responses {
    font-size: 16px;
    font-weight: bold;
    color: #666;
    padding-top: 4px;
    margin-right: 30px;
}

/* 토글 버튼 */
.chart-toggle {
    display: flex;
    gap: 4px;
    background-color: #E8ECF0;
    padding: 4px;
    border-radius: 8px;
    width: fit-content;
}

.toggle-btn {
    border: none;
    background: transparent;
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-btn.active {
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-icon {
    font-size: 16px;
    color: #666;
}

.toggle-icon.doughnut {
    padding-top: 1px;
}

.toggle-icon.bar {
    padding-left: 7px;
}

.chart-container {
    flex: 1;
    position: relative;
    width: 400px;
    height: 400px;
}

.chart-wrapper {
    position: absolute;
    width: 95%;
    height: 95%;
    align-content: center;
    transition: opacity 0.3s ease;
}

.chart-wrapper canvas {
    width: 100% !important;
    height: 100% !important;
}

.stats-content {
    display: flex;
    align-items: flex-start;
}

.chart-container {
    flex: 1;
    height: 300px;
    gap: 30px
}

.stats-details {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.stat-item {
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 15px 16px;
    background-color: #fff;
    border-radius: 8px;
    margin-right: 20px;
}

.stat-label {
    display: flex;
    width: 290px;
    align-items: center;
    gap: 16px;
    font-size: 18px;
}

.stat-values {
    display: flex;
    align-items: center;
    gap: 8px;
}

.color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.stat-count {
    font-weight: bold;
}

.stat-percentage {
    color: #666;
    font-size: 14px;
}

/* 섹션 타이틀 스타일 */
.section-title {
    font-size: 18px;
    color: #333;
    margin: 0 0 20px 10px;
}

/* 주관식 응답 & 기타 의견 공통 스타일 */
.subjective-responses {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 15px;
}

/* 스크롤바 스타일링 */
.subjective-responses::-webkit-scrollbar {
    width: 8px;
}

.subjective-responses::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.subjective-responses::-webkit-scrollbar-thumb {
    background: #E8EAEC;
    border-radius: 4px;
}

.subjective-responses::-webkit-scrollbar-thumb:hover {
    background: #D1D5D9;
}

.response-item {
    display: flex;
    gap: 16px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    align-items: flex-start;
}

.response-number {
    background-color: #E8ECF0;
    color: #666;
    width: 26px;
    height: 26px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
}

.response-text {
    margin: 0;
    font-size: 18px;
    padding-top: 2px;
}

.no-responses {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
    margin-right: 20px;
    background-color: white;
    border-radius: 8px;
    color: #666;
    font-size: 18px;
}

/* 기타 의견 섹션 */
.etc-section {
    margin-top: 20px;
}

.etc-header {
    margin-bottom: 20px;
}
</style>