import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Avatar from '../../components/Avatar';
import { GameProvider } from '../../context/GameContext';

test('renders default user icon when no avatar is set', () => {
    render(
        <GameProvider>
            <Avatar />
        </GameProvider>
    );
    const userIcon = screen.getByTestId('avatar-user-icon');
    expect(userIcon).toBeInTheDocument();
});
