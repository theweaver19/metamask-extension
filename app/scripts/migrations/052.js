import { cloneDeep, uniqBy } from 'lodash';
import {
  GOERLI,
  GOERLI_CHAIN_ID,
  KOVAN,
  KOVAN_CHAIN_ID,
  MAINNET,
  MAINNET_CHAIN_ID,
  NETWORK_TYPE_RPC,
  RINKEBY,
  RINKEBY_CHAIN_ID,
  ROPSTEN,
  ROPSTEN_CHAIN_ID,
} from '../../../shared/constants/network';

const version = 52;

/**
 * Migrate tokens in Preferences to be keyed by chainId instead of
 * providerType. To prevent breaking user's MetaMask and selected
 * tokens, this migration copies the RPC entry into *every* custom RPC
 * chainId.
 */
export default {
  version,
  async migrate(originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  },
};

function transformState(state = {}) {
  if (state.PreferencesController) {
    const {
      accountTokens,
      accountHiddenTokens,
      frequentRpcListDetail,
    } = state.PreferencesController;

    const newAccountTokens = {};
    const newAccountHiddenTokens = {};

    if (accountTokens && Object.keys(accountTokens).length > 0) {
      for (const account of Object.keys(accountTokens)) {
        newAccountTokens[account] = {};
        for (const providerType of Object.keys(accountTokens[account])) {
          switch (providerType) {
            case MAINNET:
              newAccountTokens[account][MAINNET_CHAIN_ID] =
                accountTokens[account][MAINNET];
              break;
            case ROPSTEN:
              newAccountTokens[account][ROPSTEN_CHAIN_ID] =
                accountTokens[account][ROPSTEN];
              break;
            case RINKEBY:
              newAccountTokens[account][RINKEBY_CHAIN_ID] =
                accountTokens[account][RINKEBY];
              break;
            case GOERLI:
              newAccountTokens[account][GOERLI_CHAIN_ID] =
                accountTokens[account][GOERLI];
              break;
            case KOVAN:
              newAccountTokens[account][KOVAN_CHAIN_ID] =
                accountTokens[account][KOVAN];
              break;
            default:
              break;
          }
        }
        if (accountTokens[account][NETWORK_TYPE_RPC]) {
          frequentRpcListDetail.forEach((detail) => {
            if (
              [
                MAINNET_CHAIN_ID,
                ROPSTEN_CHAIN_ID,
                RINKEBY_CHAIN_ID,
                GOERLI_CHAIN_ID,
                KOVAN_CHAIN_ID,
              ].includes(detail.chainId) &&
              Array.isArray(newAccountTokens[account][detail.chainId])
            ) {
              newAccountTokens[account][detail.chainId] = uniqBy(
                [
                  ...newAccountTokens[account][detail.chainId],
                  ...accountTokens[account][NETWORK_TYPE_RPC],
                ],
                'address',
              );
            } else {
              newAccountTokens[account][detail.chainId] =
                accountTokens[account][NETWORK_TYPE_RPC];
            }
          });
        }
      }
      state.PreferencesController.accountTokens = newAccountTokens;
    }

    if (accountHiddenTokens && Object.keys(accountHiddenTokens).length > 0) {
      for (const account of Object.keys(accountHiddenTokens)) {
        newAccountHiddenTokens[account] = {};
        for (const providerType of Object.keys(accountHiddenTokens[account])) {
          switch (providerType) {
            case MAINNET:
              newAccountHiddenTokens[account][MAINNET_CHAIN_ID] =
                accountHiddenTokens[account][MAINNET];
              break;
            case ROPSTEN:
              newAccountHiddenTokens[account][ROPSTEN_CHAIN_ID] =
                accountHiddenTokens[account][ROPSTEN];
              break;
            case RINKEBY:
              newAccountHiddenTokens[account][RINKEBY_CHAIN_ID] =
                accountHiddenTokens[account][RINKEBY];
              break;
            case GOERLI:
              newAccountHiddenTokens[account][GOERLI_CHAIN_ID] =
                accountHiddenTokens[account][GOERLI];
              break;
            case KOVAN:
              newAccountHiddenTokens[account][KOVAN_CHAIN_ID] =
                accountHiddenTokens[account][KOVAN];
              break;
            default:
              break;
          }
        }
        if (accountHiddenTokens[account][NETWORK_TYPE_RPC]) {
          frequentRpcListDetail.forEach((detail) => {
            if (
              [
                MAINNET_CHAIN_ID,
                ROPSTEN_CHAIN_ID,
                RINKEBY_CHAIN_ID,
                GOERLI_CHAIN_ID,
                KOVAN_CHAIN_ID,
              ].includes(detail.chainId) &&
              Array.isArray(newAccountHiddenTokens[account][detail.chainId])
            ) {
              newAccountHiddenTokens[account][detail.chainId] = uniqBy(
                [
                  ...newAccountHiddenTokens[account][detail.chainId],
                  ...accountHiddenTokens[account][NETWORK_TYPE_RPC],
                ],
                'address',
              );
            } else {
              newAccountHiddenTokens[account][detail.chainId] =
                accountHiddenTokens[account][NETWORK_TYPE_RPC];
            }
          });
        }
      }
      state.PreferencesController.accountHiddenTokens = newAccountHiddenTokens;
    }
  }
  return state;
}
