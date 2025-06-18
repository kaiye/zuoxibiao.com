import React, { createContext, useContext } from 'react'

const ScheduleContext = createContext()

export const ScheduleProvider = ({ children, value }) => {
  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  )
}

export const useSchedule = () => {
  const context = useContext(ScheduleContext)
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider')
  }
  return context
}

export default ScheduleContext