import React from "react";

export default function BetaWarning() {
  return (
    <div style={{
      textAlign: 'center',
      paddingTop: 8,
      paddingBottom: 2,
      backgroundColor: 'rgba(255, 190, 118, 0.4)'
    }}>
      <p>
        This is a <b>beta</b> version of this workshop — expect very minor changes.{" "}
        <a
          href="https://github.com/christiannwamba/herm-workshop/issues/new"
          target="_blank"
        >
          Open an issue
        </a>{" "}
        if you are lost.
      </p>
    </div>
  );
}
