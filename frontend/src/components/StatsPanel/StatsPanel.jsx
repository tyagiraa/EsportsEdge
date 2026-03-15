import React from 'react';
import PropTypes from 'prop-types';
import './StatsPanel.css';

function StatsPanel({ stats, title }) {
  return (
    <section className="stats-panel">
      {title && <h3 className="stats-panel__title">{title}</h3>}
      <dl className="stats-panel__list">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="stats-panel__row">
            <dt className="stats-panel__term">{key}</dt>
            <dd className="stats-panel__value">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

StatsPanel.propTypes = {
  stats: PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default StatsPanel;
