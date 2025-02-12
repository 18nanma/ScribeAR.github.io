import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { 
   DisplayStatus, AzureStatus, ControlStatus, 
   ApiStatus, SRecognition } from '../../../react-redux&middleware/redux/typesImports'


import { LoungeVisual } from './loungeVisual'
import { TimeDataVisual } from './timeDataVisual';
import { Draggable } from './DraggableFC';
import { Resizable } from './Resizable';
import { MFCCVisual } from './mfccVisual';
import SpeakerShow from './speakerShow';


export const AudioVis: React.FC = (props) => {
   const controlStatus = useSelector((state: RootState) => {
      return state.ControlReducer as ControlStatus;
   });

   const getAudioVis = () => {
      if (controlStatus.showTimeData === true) {
         return (
            <Draggable id="fullVisual">
               <Resizable size="290px">
                  <TimeDataVisual></TimeDataVisual>
               </Resizable>
            </Draggable>
         )
      } else if (controlStatus.showFrequency === true) {
         return (
            <Draggable id="fullVisual">
               <Resizable size="290px">
                  <LoungeVisual></LoungeVisual>
               </Resizable>
            </Draggable>
         )
      } else if (controlStatus.showMFCC === true) {
         return (
            <Draggable id="fullVisual">
               <Resizable size="290px">
                  <MFCCVisual></MFCCVisual>
               </Resizable>
            </Draggable>
         )
      } else {
         // return (<div></div>)
      }
   }

   const audioVis = getAudioVis();

   return (
      // Use parentheses to wrap the JSX expression for readability
      <div>
         {audioVis}
         {controlStatus.showSpeaker ? (
            <Draggable id="speakerShow" left="250">
               <SpeakerShow />
            </Draggable>
         ) : null}
      </div>
   );
}