declare module 'react-katex' {
  import * as React from 'react';

  export interface InlineMathProps {
    math: string;
  }

  export class InlineMath extends React.Component<InlineMathProps> {}

  export interface BlockMathProps {
    math: string;
  }

  export class BlockMath extends React.Component<BlockMathProps> {}
}
