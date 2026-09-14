import { ApiAccessTokenBridge } from '@jujistu/app/providers/ApiAccessTokenBridge';
import {
  setApiAccessTokenProvider,
  setApiUnauthorizedHandler,
  tokenManager,
} from '@jujistu/shared/services/api';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('@jujistu/shared/services/api', () => {
  const actual = jest.requireActual('@jujistu/shared/services/api');
  return {
    ...actual,
    setApiAccessTokenProvider: jest.fn(),
    setApiUnauthorizedHandler: jest.fn(),
    tokenManager: {
      getAccessToken: jest.fn().mockResolvedValue('bridge-test-token'),
      getRefreshToken: jest.fn(),
      saveTokens: jest.fn(),
      clearTokens: jest.fn(),
    },
  };
});

describe('ApiAccessTokenBridge', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('registers access token provider and unauthorized handler on mount', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ApiAccessTokenBridge>
          <></>
        </ApiAccessTokenBridge>,
      );
    });

    expect(setApiAccessTokenProvider).toHaveBeenCalledWith(
      expect.any(Function),
    );
    expect(setApiUnauthorizedHandler).toHaveBeenCalledWith(
      expect.any(Function),
    );

    // Test the registered access token provider function
    const registeredProvider = (setApiAccessTokenProvider as jest.Mock).mock
      .calls[0][0];
    const token = await registeredProvider();
    expect(token).toBe('bridge-test-token');
    expect(tokenManager.getAccessToken).toHaveBeenCalled();

    // Clean up
    await ReactTestRenderer.act(() => {
      renderer.unmount();
    });

    expect(setApiAccessTokenProvider).toHaveBeenCalledWith(null);
    expect(setApiUnauthorizedHandler).toHaveBeenCalledWith(null);
  });
});
