<template>
  <div class="survey-page">
    <div class="survey-title">
      <!-- 제목 및 설명 박스 -->
      <div class="survey-box">
        <h2 class="survey-title">설문 제목</h2>
        <p class="survey-description">
          설문에 대한 간략한 설명을 여기에 작성합니다.
        </p>
      </div>

      <!-- 단일 선택 박스 -->
      <div class="survey-box">
        <h3 class="question-title">질문 1: 단일 선택</h3>
        <div class="options">
          <label>
            <input type="radio" name="question1" value="option1" />
            선택지 1
          </label>
          <label>
            <input type="radio" name="question1" value="option2" />
            선택지 2
          </label>
          <label>
            <input type="radio" name="question1" value="option3" />
            선택지 3
          </label>
        </div>
      </div>

      <!-- 다중 선택 박스 -->
      <div class="survey-box">
        <h3 class="question-title">질문 2: 다중 선택</h3>
        <div class="options">
          <label>
            <input type="checkbox" name="question2" value="option1" />
            선택지 1
          </label>
          <label>
            <input type="checkbox" name="question2" value="option2" />
            선택지 2
          </label>
          <label>
            <input type="checkbox" name="question2" value="option3" />
            선택지 3
          </label>
        </div>
      </div>
      <!-- 다중 선택 박스 -->
      <div class="survey-box">
        <h3 class="question-title">질문 2: 다중 선택</h3>
        <div class="options">
          <label>
            <input type="checkbox" name="question2" value="option1" />
            선택지 1
          </label>
          <label>
            <input type="checkbox" name="question2" value="option2" />
            선택지 2
          </label>
          <label>
            <input type="checkbox" name="question2" value="option3" />
            선택지 3
          </label>
        </div>
      </div>
      <!-- 다중 선택 박스 -->
      <div class="survey-box">
        <h3 class="question-title">질문 2: 다중 선택</h3>
        <div class="options">
          <label>
            <input type="checkbox" name="question2" value="option1" />
            선택지 1
          </label>
          <label>
            <input type="checkbox" name="question2" value="option2" />
            선택지 2
          </label>
          <label>
            <input type="checkbox" name="question2" value="option3" />
            선택지 3
          </label>
        </div>
      </div>

      <!-- 주관식 박스 -->
      <div class="survey-box">
        <h3 class="question-title">질문 3: 주관식</h3>
        <textarea
          class="input-field"
          rows="4"
          placeholder="답변을 입력하세요."
        ></textarea>
      </div>

      <!-- 제출 버튼 -->
      <button class="submit-button">설문 제출</button>
    </div>
  </div>
</template>
<style scoped>
.survey-page {
  width: 100%;
  height: 100%; /* 뷰포트 높이에 맞게 */
  overflow-y: auto;
}

.survey-title {
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 8px;
  overflow-y: auto; /* 세로 스크롤 활성화 */
}

.survey-box {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.04);
  padding: 20px;
  margin-bottom: 20px;
}

.survey-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.survey-description {
  font-size: 14px;
  color: #6e6a7c;
}

.question-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.options label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  resize: none;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
