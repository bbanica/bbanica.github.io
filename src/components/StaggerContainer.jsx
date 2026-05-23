import React from 'react';
import { useInView } from '../hooks.js';

export default function StaggerContainer({ children, delay = 0, stagger = 0.1 }) {
  const [ref, isInView] = useInView();
  return (
    <div ref={ref}>
      {React.Children.map(children, (child, index) => (
        <div style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(20px)', transition: `all 0.5s cubic-bezier(0.32, 0.72, 0, 1) ${delay + index * stagger}s` }}>
          {child}
        </div>
      ))}
    </div>
  );
}
