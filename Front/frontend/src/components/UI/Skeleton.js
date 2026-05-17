import React from 'react';

export const SkeletonCard = () => (
  <div className="skeleton" style={{ height: '120px', borderRadius: '20px' }} />
);

export const SkeletonText = ({ width = '100%', height = '16px', style = {} }) => (
  <div className="skeleton" style={{ width, height, borderRadius: '8px', marginBottom: '8px', ...style }} />
);

export const SkeletonAvatar = ({ size = 48 }) => (
  <div className="skeleton" style={{ width: size, height: size, borderRadius: '50%' }} />
);

export const SkeletonStats = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '20px' }} />
    ))}
  </div>
);

export const SkeletonRoadmap = () => (
  <div>
    {[1, 2, 3].map(i => (
      <div key={i} className="skeleton" style={{ height: '150px', borderRadius: '20px', marginBottom: '16px' }} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div>
    <div className="skeleton" style={{ height: '40px', borderRadius: '12px', marginBottom: '12px' }} />
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="skeleton" style={{ height: '50px', borderRadius: '12px', marginBottom: '8px' }} />
    ))}
  </div>
);

export const SkeletonProfile = () => (
  <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
    <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
    <div style={{ flex: 1 }}>
      <div className="skeleton" style={{ width: '200px', height: '24px', borderRadius: '8px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '150px', height: '16px', borderRadius: '8px' }} />
    </div>
  </div>
);

export const SkeletonDashboard = () => (
  <div>
    <SkeletonStats />
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
      <div className="skeleton" style={{ flex: 1, height: '120px', borderRadius: '20px' }} />
      <div className="skeleton" style={{ flex: 1, height: '120px', borderRadius: '20px' }} />
    </div>
    <SkeletonCard />
    <SkeletonText width="60%" />
    <SkeletonText />
    <SkeletonText width="80%" />
  </div>
);

export const SkeletonDirectory = () => (
  <div>
    <div className="skeleton" style={{ height: '48px', borderRadius: '16px', marginBottom: '24px' }} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton" style={{ height: '180px', borderRadius: '20px' }} />
      ))}
    </div>
  </div>
);

export const SkeletonRoadmapPage = () => (
  <div>
    <div className="skeleton" style={{ height: '100px', borderRadius: '20px', marginBottom: '24px' }} />
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '20px', marginBottom: '16px' }} />
    ))}
  </div>
);

export const SkeletonChat = () => (
  <div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ display: 'flex', gap: '12px', justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
          <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          <div className="skeleton" style={{ width: '200px', height: '60px', borderRadius: '16px' }} />
        </div>
      ))}
    </div>
    <div style={{ display: 'flex', gap: '12px' }}>
      <div className="skeleton" style={{ flex: 1, height: '48px', borderRadius: '20px' }} />
      <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '20px' }} />
    </div>
  </div>
);

export default {
  SkeletonCard,
  SkeletonText,
  SkeletonAvatar,
  SkeletonStats,
  SkeletonRoadmap,
  SkeletonTable,
  SkeletonProfile,
  SkeletonDashboard,
  SkeletonDirectory,
  SkeletonRoadmapPage,
  SkeletonChat
};