<template>
    <div class="question-stats">
        <div class="question-header">
            <div class="title-section">
                <h4 class="question-title">{{ question }}</h4>
                <div v-if="responseType === 'single' || responseType === 'multiple'" class="chart-toggle">
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
                총 응답수: {{ totalResponses }}명
            </span>
        </div>

        <div class="stats-content">
            <!-- 객관식 질문 (단일/다중 선택) -->
            <template v-if="responseType === 'single' || responseType === 'multiple'">
                <div class="chart-container">
                    <div v-show="chartType === 'doughnut'" class="chart-wrapper">
                        <canvas ref="doughnutCanvas"></canvas>
                    </div>
                    <div v-show="chartType === 'bar'" class="chart-wrapper">
                        <canvas ref="barCanvas"></canvas>
                    </div>
                </div>

                <div class="stats-details">
                    <div v-for="(option, index) in options" :key="option.id" class="stat-item">
                        <div class="stat-label">
                            <span class="color-dot" :style="{ backgroundColor: chartColors[index] }"></span>
                            <span>{{ option.text }}</span>
                        </div>
                        <div class="stat-values">
                            <span class="stat-count">{{ option.count }}명</span>
                            <span class="stat-percentage">({{ calculatePercentage(option.count) }}%)</span>
                        </div>
                    </div>
                </div>
            </template>

            <!-- 주관식 질문 -->
            <template v-else-if="responseType === 'open'">
                <div class="subjective-responses">
                    <div v-for="(response, index) in responses" :key="index" class="response-item">
                        <span class="response-number">{{ index + 1 }}</span>
                        <p class="response-text">{{ response }}</p>
                    </div>
                </div>
            </template>
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
            type: String,
            required: true,
        },
        responseType: {
            type: String,
            required: true,
            validator: value => ['single', 'multiple', 'open'].includes(value),
        },
        options: {
            type: Array,
            default: () => [],
        },
        responses: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            chartType: 'doughnut',
            isChanging: false,
            chartColors: ['#95A4FC', '#BAEDBD', '#FFFDB5', '#B1E3FF', '#F9E2AF'],
            doughnutChart: null,
            barChart: null,
        };
    },
    computed: {
        totalResponses() {
            if (this.responseType === 'open') {
                return this.responses.length;
            }
            return this.options.reduce((sum, option) => sum + option.count, 0);
        },
        chartData() {
            const labels = this.options.map(option => option.text);
            const data = this.options.map(option => option.count);
            const colors = this.chartColors.slice(0, labels.length);

            if (this.chartType === 'doughnut') {
                return {
                    labels: labels.reverse(),
                    datasets: [{
                        data: data.reverse(),
                        backgroundColor: colors.reverse(),
                    }],
                };
            }

            return {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                }],
            };
        },
    },
    mounted() {
        if (this.responseType === 'single' || this.responseType === 'multiple') {
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
            return ((value / this.totalResponses) * 100).toFixed(1);
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
                    animation: { duration: 300 },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            displayColors: false,
                            callbacks: {
                                label: (context) => {
                                    const index = this.chartType === 'doughnut' ?
                                        this.options.length - 1 - context.dataIndex :
                                        context.dataIndex;
                                    const option = this.options[index];
                                    const percentage = this.calculatePercentage(option.count);
                                    return `${option.text}: ${option.count}명 (${percentage}%)`;
                                },
                            },
                        },
                    },
                },
            };

            if (type === 'doughnut') {
                baseConfig.options.cutout = '88%';
                baseConfig.data.datasets[0].borderWidth = 28;
                baseConfig.data.datasets[0].hoverBorderWidth = 30; // 호버 시 두께 고정
                baseConfig.data.datasets[0].borderRadius = 30;
                baseConfig.data.datasets[0].borderColor = baseConfig.data.datasets[0].backgroundColor;
            } else {
                baseConfig.options.scales = {
                    y: { grid: { display: false } },
                    x: { grid: { display: false }, beginAtZero: true },
                };
                baseConfig.data.datasets[0].borderRadius = 15;
                baseConfig.data.datasets[0].borderWidth = 0;
            }

            return baseConfig;
        },
        initializeCharts() {
            this.destroyCharts();

            const doughnutCtx = this.$refs.doughnutCanvas?.getContext('2d');
            const barCtx = this.$refs.barCanvas?.getContext('2d');

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
            if (this.doughnutChart) {
                this.doughnutChart.destroy();
                this.doughnutChart = null;
            }
            if (this.barChart) {
                this.barChart.destroy();
                this.barChart = null;
            }
        },
    },
    watch: {
        options: {
            handler() {
                if (this.responseType === 'single' || this.responseType === 'multiple') {
                    this.updateCharts();
                }
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

/* 주관식 응답 */
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
</style>