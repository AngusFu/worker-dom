/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { CommandExecutorInterface } from './interface';
import { DOMManipulationMutationIndex } from '../../transfer/TransferrableDOMManipulation';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

export const DOMManipulationProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.DOM_MANIPULATION);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const targetIndex = mutations[startPosition + DOMManipulationMutationIndex.Target];
        const target = nodes.getNode(targetIndex);
        const keyIndex = mutations[startPosition + DOMManipulationMutationIndex.Key];
        const key = strings.get(keyIndex);

        if (target) {
          workerContext.messageToWorker({
            [TransferrableKeys.type]: MessageType.DOM_MANIPULATION,
            [TransferrableKeys.target]: [target._index_],
            [TransferrableKeys.data]: target[key],
          });
        } else {
          console.error(`DOM_MANIPULATION: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + DOMManipulationMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const targetIndex = mutations[startPosition + DOMManipulationMutationIndex.Target];
      const target = nodes.getNode(targetIndex);
      return {
        type: 'DOM_MANIPULATION',
        target,
        allowedExecution,
      };
    },
  };
};
