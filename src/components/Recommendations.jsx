import React from 'react'

const Recommendations = ({ schedule }) => {
  if (!schedule || !schedule.additional_recommendations || schedule.additional_recommendations.length === 0) {
    return null
  }

  return (
    <div className="additional-recommendations">
      <h3>补充建议</h3>
      {schedule.additional_recommendations.map((rec, index) => (
        <div key={index} className="recommendation-item">
          {rec.period && (
            <div className="recommendation-period">{rec.period}</div>
          )}
          <div className="recommendation-note">{rec.note}</div>
        </div>
      ))}
    </div>
  )
}

export default Recommendations