import { Shape } from '../../lib/types';
import { generatePreview, getPreviewCells, placeShapeOnPreview } from '../../lib/utils';
import FieldCell from "../FieldCell";
import { useMemo } from 'react';

import './index.css'

interface ShapePreviewProps {
  shape: Shape;
}

const PreviewCells = generatePreview();

/**
 * TODO:
 * - adaptive design
 * - make buttons usable on phone
 * - restart button
 * - unificate preview & field utils
 * - refactor
 */
export function ShapePreview({ shape }: ShapePreviewProps) {
  const previewSnapshot = useMemo(
    () => placeShapeOnPreview(PreviewCells, shape),
    [shape]
  );

  const cells = useMemo(
    () => getPreviewCells(previewSnapshot),
    [previewSnapshot]
  );

  return <div className="shape-preview">
    <div className="shape-preview__title">
      Next shape:
    </div>
    <div className="shape-preview__screen">
      {cells.map((cell, index) => (
        <FieldCell
          key={index}
          cell={cell}
        />
      ))}
    </div>
  </div>
}
