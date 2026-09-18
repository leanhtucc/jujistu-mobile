import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Path, Stop, Text as SvgText } from 'react-native-svg';

import { JujitsuChampionshipTitle } from '@jujistu/ui';

describe('JujitsuChampionshipTitle', () => {
  it('renders the font as a complete vector outline instead of SvgText', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(<JujitsuChampionshipTitle />);
    });

    expect(tree.root.findAllByType(SvgText)).toHaveLength(0);
    expect(tree.root.findAllByType(Stop)).toHaveLength(13);

    const paths = tree.root.findAllByType(Path);
    const outline = paths.find(path => path.props.stroke === '#000000')!;
    expect(paths).toHaveLength(2);
    expect(outline.props.d).toContain('M11545 50H12156V365');
    expect(outline.props).toMatchObject({
      stroke: '#000000',
      strokeWidth: 34,
    });
  });
});
