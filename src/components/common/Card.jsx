import React from "react";

export const Card = ({
  children,
  className = "",
  title,
  description,
  headerAction,
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm transition-all ${className}`}
    >
      {(title || description || headerAction) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-800">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
