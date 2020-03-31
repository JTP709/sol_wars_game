import React from 'react';
import { render, fireEvent, waitFor, screen, findBy, findByTestId } from '@testing-library/react';

import GameManagement from './GameManagement';

test('starts a new game and generates a game ID when the user clicks Start A New Game', () => {
  const { getByText } = render(<GameManagement/>);

  fireEvent.click(getByText('Start A New Game'));

  expect(getByText('Game Id:')).toBeTruthy();
});

test.skip('joins a game in progress when the user clicks Join A Game button', () => {
  
});
