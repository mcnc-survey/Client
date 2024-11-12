# Client

## 프로젝트 기능

### 주요 페이지

#### 웹

- **Login**: 사용자 로그인 화면
- **Survey Management**: 사용자가 만든 설문 목록을 관리할 수 있는 페이지
- **Survey Edit**: 특정 설문을 편집하는 페이지
- **Survey Stats**: 설문 통계를 확인하는 페이지
- **Survey Create**: 새로운 설문을 생성하는 페이지
- **Survey Completion**: 설문이 완료된 페이지
- **Calendar**: 설문 일정 및 상태를 표시하는 캘린더 페이지
- **Deleted Items**: 삭제된 항목을 관리하는 페이지

#### 모바일

- **Participant Info**: 설문 참여자의 정보 입력 페이지
- **Survey Participation**: 설문을 실제로 진행하는 페이지
- **Survey Completion**: 설문 완료 페이지

## 프로젝트 구조

src/
│
├── assets/ # 이미지, 스타일 등 정적 파일
├── components/ # 재사용 가능한 Vue 컴포넌트
├── mobile/ # 모바일 뷰 페이지들
│ │
│ ├── ParticipantInfo.vue # 설문 참여자 정보 입력 페이지
│ │
│ ├── SurveyParticipation.vue # 설문 참여 페이지
│ │
│ └── SurveyCompletion.vue # 설문 완료 페이지
│
├── views/ # 주요 페이지들
│ │
│ ├── Login.vue # 로그인 페이지
│ │
│ ├── SurveyManagement.vue # 설문 목록 관리 페이지
│ │
│ ├── SurveyEdit.vue # 설문 편집 페이지
│ │
│ ├── SurveyStats.vue # 설문 통계 페이지
│ │
│ ├── SurveyCreate.vue # 설문 생성 페이지
│ │
│ ├── SurveyCompletion.vue # 설문 완료 페이지
│ │
│ ├── Calendar.vue # 캘린더 페이지
│ │
│ └── DeletedItems.vue # 삭제된 항목 관리 페이지
│
├── router/ # Vue Router 설정
│
└── index.js # 라우터 설정 파일
├── App.vue # 최상위 컴포넌트
└── main.js # Vue 인스턴스 및 라우터 설정
