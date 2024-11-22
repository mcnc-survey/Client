<template>
    <div class="question-stats">
        <div class="question-header">
            <div class="title-section">
                <h4 class="question-title">{{ question }}</h4>
                <div class="chart-toggle">
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
            <span class="total-responses">총 응답수: {{ totalResponses }}명</span>
        </div>

        <div class="stats-content">
            <div class="chart-container">
                <div v-show="chartType === 'doughnut'" class="chart-wrapper">
                    <canvas ref="doughnutCanvas"></canvas>
                </div>
                <div v-show="chartType === 'bar'" class="chart-wrapper">
                    <canvas ref="barCanvas"></canvas>
                </div>
            </div>

            <div class="stats-details">
                <div v-for="(value, index) in data" :key="index" class="stat-item">
                    <div class="stat-label">
                        <span class="color-dot" :style="{ backgroundColor: chartColors[index] }"></span>
                        <span>{{ labels[index] }}</span>
                    </div>
                    <div class="stat-values">
                        <span class="stat-count">{{ value }}명</span>
                        <span class="stat-percentage">({{ calculatePercentage(value) }}%)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Chart,
    DoughnutController,
    BarController,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
} from "chart.js";

Chart.register(DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);

export default {
    name: "QuestionStats",
    props: {
        question: {
            type: String,
            required: true,
        },
        labels: {
            type: Array,
            required: true,
        },
        data: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            chartType: "doughnut", // 기본 차트 유형
            isChanging: false,
            chartColors: ["#95A4FC", "#BAEDBD", "#FFFDB5", "#B1E3FF", "#F9E2AF"],
            doughnutChart: null, // 도넛 차트 인스턴스
            barChart: null, // 바 차트 인스턴스
        };
    },
    computed: {
        // 총 응답 수 계산
        totalResponses() {
            return this.data.reduce((sum, value) => sum + value, 0);
        },
        // 그래프 타입에 따른 데이터를 생성
        chartData() {
            const labels = [...this.labels];
            const data = [...this.data];
            const colors = [...this.chartColors];

            // 도넛 그래프에서는 데이터와 라벨을 역순으로
            if (this.chartType === "doughnut") {
                return {
                    labels: labels.reverse(),
                    datasets: [
                        {
                            data: data.reverse(),
                            backgroundColor: colors.slice(0, labels.length).reverse(),
                        },
                    ],
                };
            }

            // 바 그래프에서는 원래 순서 유지
            return {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: colors.slice(0, labels.length),
                    },
                ],
            };
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.initializeCharts();
            this.updateCharts();  // DOM이 준비된 후 차트 초기화
        });
    },
    beforeUnmount() {
        this.destroyCharts();
    },
    methods: {
        // 응답 데이터를 퍼센트로 계산
        calculatePercentage(value) {
            return ((value / this.totalResponses) * 100).toFixed(1);
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
        // 차트 유형 변경 (도넛, 바)
        async handleChartTypeChange(newType) {
            if (this.isChanging || this.chartType === newType) return;

            this.isChanging = true;
            this.chartType = newType;

            await this.$nextTick(); // DOM 업데이트 후 실행
            this.updateCharts();

            setTimeout(() => {
                this.isChanging = false;
            }, 300);
        },
        // 차트 설정 반환
        getChartConfig(type) {
            const baseConfig = {
                type,
                data: this.chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 300, // 기본 애니메이션 시간
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
                                    const value = this.data[context.dataIndex];
                                    const percentage = this.calculatePercentage(value);
                                    return `${value}명 (${percentage}%)`;
                                },
                            },
                        },
                    },
                },
            };

            if (type === "doughnut") { // 도넛 그래프 설정
                baseConfig.data.datasets[0].borderWidth = 30;
                baseConfig.data.datasets[0].hoverBorderWidth = 30; // 호버 시 두께 고정
                baseConfig.data.datasets[0].borderRadius = 30;
                baseConfig.data.datasets[0].borderColor = baseConfig.data.datasets[0].backgroundColor;
                baseConfig.options.cutout = "90%";
            } else { // 바 그래프 설정
                baseConfig.data.datasets[0].borderWidth = 0;
                baseConfig.data.datasets[0].borderRadius = 15;
                baseConfig.options.scales = {
                    y: {
                        grid: { display: false },
                    },
                    x: {
                        grid: { display: false },
                        beginAtZero: true,
                    },
                };
            }

            return baseConfig;
        },
        initializeCharts() {
            const doughnutCtx = this.$refs.doughnutCanvas?.getContext("2d");
            const barCtx = this.$refs.barCanvas?.getContext("2d");

            if (doughnutCtx) {
                this.doughnutChart = new Chart(doughnutCtx, this.getChartConfig("doughnut"));
                // 추가: borderWidth 확인
                this.doughnutChart.data.datasets[0].borderWidth = 30;
            }
            if (barCtx) {
                this.barChart = new Chart(barCtx, this.getChartConfig("bar"));
                // 추가: borderWidth 확인
                this.barChart.data.datasets[0].borderWidth = 0;
            }
        }
        ,
        // 차트를 업데이트
        updateCharts() {
            this.destroyCharts(); // 기존 차트 파괴
            this.initializeCharts(); // 새 차트 초기화
        },
    },
    watch: {
        data: {
            handler() {
                // 데이터 변경 시 차트 업데이트
                this.updateCharts();
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
.question-stats {
    padding: 30px;
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
    padding: 4px 8px 0 0;
}

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
    padding: 8px;
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
    padding: 14px 16px;
    background-color: #fff;
    border-radius: 8px;
}

.stat-label {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 290px;
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
</style>