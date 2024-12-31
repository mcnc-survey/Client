<template>
  <div class="notifications" v-if="isNotificationsOpen">
    <h3>알림</h3>
    <ul v-if="notifications.length > 0">
      <li v-for="notification in notifications" :key="notification.id">  <!-- index 대신 notification.id 사용 -->
        <div class="notification-item">
          <div class="icon-wrapper">
            <img src="@/assets/images/notification.svg" alt="알림" class="notification-icon">
          </div>
          <span class="notification-text" @click="readNotification(notification.id)">{{ notification.message }}</span>
          <div class="notification-meta">
            <span class="notification-time">{{ formatDate(notification.createdAt) }}</span>
            <button 
              class="delete-button"
              @click="deleteNotification(notification.id)"  
              title="알림 삭제">
              <img src="@/assets/images/delete_notification.svg" alt="삭제" class="delete-icon">
            </button>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="no-notifications">
      알림이 없습니다.
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { notificationAPI } from '@/service/surveyService'
import instance from '@/service/axios'

export default defineComponent({
  name: 'Notifications',

  props: {
    isNotificationsOpen: {
      type: Boolean,
      required: true,
    },
  },

  setup() {
    const notifications = ref([])
    let eventSource = null

    const deleteNotification = async (notificationId) => {
      try {
        // API 호출 시 notificationId를 사용
        const response = await notificationAPI.deleteNotification(notificationId)
        
        if (response.status === 200 || response.status === 204) {
          // 성공적으로 삭제되면 해당 id의 알림을 목록에서 제거
          notifications.value = notifications.value.filter(
            notification => notification.id !== notificationId
          )
          console.log('Notification deleted successfully:', notificationId)
        } else {
          console.error('Failed to delete notification:', response)
        }
      } catch (error) {
        console.error('Error deleting notification:', error)
      }
    }

    const readNotification = async (notificationId) => {
      try {
        const response = await notificationAPI.getNotificationDetail(notificationId)
        
        if (response.status === 200 || response.status === 204) {
          console.log('Notification read successfully:', notificationId)
        } else {
          console.error('Failed to read notification:', response)
        }
      } catch (error) {
        console.error('Error reading notification:', error)
      }
    }

    const fetchInitialNotifications = async () => {
      try {
        const response = await notificationAPI.getNotifications()
        notifications.value = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )
        console.log('Initial notifications loaded:', notifications.value)
      } catch (error) {
        console.error('Failed to fetch initial notifications:', error)
      }
    }

    const connectEventSource = async () => {
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }

      let token = localStorage.getItem('accessToken')
      if (!token) {
        console.error('No access token found in localStorage')
        return
      }

      const connectWithToken = (currentToken) => {
        const eventSourceOptions = {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          },
          withCredentials: true,
          heartbeatTimeout: 30000
        }

        try {
          console.log('Starting EventSource connection...', new Date().toISOString())
          
          eventSource = new EventSourcePolyfill(
            'https://web.mcnc-survey.store/notifications/subscribe',
            eventSourceOptions
          )

          eventSource.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data)
              console.log('Received notification:', data)
              
              const existingIndex = notifications.value.findIndex(
                notification => notification.id === data.id
              )
              
              if (existingIndex === -1) {
                notifications.value = [data, ...notifications.value].slice(0, 30)
              }
            } catch (error) {
              console.error('Failed to parse notification:', error)
            }
          }

          eventSource.onopen = (event) => {
            console.log('EventSource connection established', new Date().toISOString())
          }

          eventSource.onerror = async (error) => {
            console.error('EventSource error:', error)
            
            // 401 에러 처리
            if (error.status === 401) {
              try {
                console.log('Attempting to refresh token for EventSource...')
                const response = await instance.post('/token/reissue')
                if (response.data.success) {
                  const newToken = response.data.body.accessToken
                  localStorage.setItem('accessToken', newToken)
                  
                  // 새 토큰으로 EventSource 재연결
                  eventSource.close()
                  connectWithToken(newToken)
                }
              } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)
                localStorage.removeItem('accessToken')
                window.location.href = '/'
              }
            } 
            // 다른 에러나 연결 끊김 처리
            else if (eventSource.readyState === EventSourcePolyfill.CLOSED || 
                    eventSource.readyState === EventSourcePolyfill.CONNECTING) {
              console.log('Connection lost or error occurred, reconnecting...')
              setTimeout(() => {
                connectEventSource()
              }, 1000)
            }
          }
        } catch (error) {
          console.error('Failed to create EventSource:', error)
          setTimeout(connectEventSource, 1000)
        }
      }

      // 초기 연결 시도
      connectWithToken(token)
    }

    const checkConnection = () => {
      if (!eventSource || eventSource.readyState === EventSourcePolyfill.CLOSED) {
        console.log('Connection check: Reconnecting...', new Date().toISOString())
        connectEventSource()
      }
    }

    onMounted(async () => {
      await fetchInitialNotifications()
      connectEventSource()
      
      const intervalId = setInterval(checkConnection, 30000)
      
      onUnmounted(() => {
        clearInterval(intervalId)
        if (eventSource) {
          console.log('Closing EventSource connection')
          eventSource.close()
          eventSource = null
        }
      })
    })

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}.${month}.${day} ${hours}:${minutes}`
    }

    return {
      notifications,
      formatDate,
      deleteNotification,
      readNotification
    }
  }
})
</script>

<style scoped>
.notifications {
  width: 16%;
  background-color: #ffffff;
  padding: 10px;
  border-left: 3px solid #E8E8E8;
  max-height: 100%;
  overflow-y: auto;
}

.notifications::-webkit-scrollbar {
  width: 6px;
}

.notifications::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.notifications::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.notifications::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.notifications h3 {
  margin-top: 5%;
  margin-left: 3%;
  margin-bottom: 10%;
}

.notifications ul {
  list-style-type: none;
  padding-left: 0;
}

.notifications li {
  padding: 5px;
}

.notifications li:hover {
  background-color: #e1e1e1;
}

.notification-item {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 5px;
  min-height: 60px;
}

.notification-text {
  font-size: 14px;
  padding-left: 35px;
  /* 텍스트가 여러 줄일 때를 대비한 여백 확보 */
}

.notification-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 35px;
  /* 메타 정보의 위치를 고정 */
  height: 20px;
}

.icon-wrapper {
  position: absolute;
  left: 5px;
  top: 5px;
}

.notification-icon {
  width: 25px;
  height: 25px;
}

.no-notifications {
  text-align: center;
  color: #666;
  padding: 20px 0;
}

.delete-button {
  position: static;
  transform: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  margin-left: 10px;
  height: 20px;
  width: 20px;
  display: none;  /* 기본적으로는 보이지 않음 */
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.delete-icon {
  width: 16px;
  height: 16px;
}

/* hover 상태일 때만 삭제 버튼 표시 */
.notification-item:hover .delete-button {
  display: flex;  /* hover 상태에서만 flex로 표시 */
}

.notification-time {
  font-size: 12px;
  color: #A4A4A4;
}
</style>