import axios from './axios';

export const surveyAPI = {
  createSurvey: (data) => axios.post('/surveys', data),
  getSurveyForEdit: (surveyId) => axios.get(`/surveys/survey-id/${surveyId}/edit`),
  updateSurvey: (surveyId, data) => axios.put(`/surveys/survey-id/${surveyId}`, data),
};