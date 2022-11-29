import * as React from 'react';
import { useWebSpeechRecog } from './web-speech/webSpeechRecognition';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { RootState } from '../../store';
import { useAzureTranslRecog } from './azure/azureRecognition';
import { DisplayStatus, AzureStatus, ControlStatus, ApiStatus } from '../../react-redux&middleware/redux/typesImports'
import { LoungeVisual } from './visualization/loungeVisual'
import { TimeDataVisual } from './visualization/timeDataVisual';
import { Draggable } from './visualization/DraggableFC';
import { Resizable } from './visualization/Resizable';
var transcriptsFull = "testing"
let desiredAPI = 0;

export const WebRecognitionExample: React.FC = (props) => {
  const dispatch = useDispatch()
  const control = useSelector((state: RootState) => {
    return state.ControlReducer as ControlStatus;
  });
  const textSize = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
  });
  const azureStatus = useSelector((state: RootState) => {
    return state.AzureReducer as AzureStatus
  })
  const apiStatus = useSelector((state: RootState) => {
    return state.APIStatusReducer as ApiStatus
  })
  React.useEffect(() => {
    if (control.listening == true) {
      if (apiStatus.currentApi == 0) {
        desiredAPI = 0
        webspeechHandler()
      } else if (apiStatus.currentApi == 1) {
        desiredAPI = 1
        azureHandler()
      }
    } 
  }, [control.listening, apiStatus.currentApi]);
  document.addEventListener("DOMContentLoaded", () => {
    if (apiStatus.currentApi == 1) {
      Swal.fire({
        title: 'It appears you have a valid Microsoft Azure key, would you like to use Microsoft Azure?',
        icon: 'info',
        allowOutsideClick: false,
        showDenyButton: true,
        confirmButtonText: 'Yes!',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Switching to Azure', '', 'success')
          desiredAPI = 1
          azureHandler()
        } else {
          let copyStatus = Object.assign({}, apiStatus);
          copyStatus.currentApi = 0
          dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
          webspeechHandler()
        }
      })
    } 
  });
  const textSizeA = "" + textSize.textSize + "vh"
  const { azureTranscripts, azureListen } = useAzureTranslRecog();
  const { transcripts, listen } = useWebSpeechRecog();

  const stateRefControl = React.useRef(control)
  const stateRefAzure = React.useRef(azureStatus)
  const stateCurrentAPI = React.useRef(apiStatus)
  stateRefControl.current = control
  stateRefAzure.current = azureStatus
  stateCurrentAPI.current = apiStatus
  const webspeechHandler = async () => {
    const recognizedMessage = await listen(transcriptsFull, stateRefControl, stateCurrentAPI).then(response => {  
      if (stateRefControl.current.listening && stateCurrentAPI.current.currentApi == 0) {
          transcriptsFull = transcriptsFull + response
          webspeechHandler()
        }
      }
    );
  };
  const azureHandler = async () => {
    const recognizedMessage = await azureListen(transcriptsFull, stateRefControl, stateRefAzure, stateCurrentAPI).then(response => {  
      if (stateRefControl.current.listening && stateCurrentAPI.current.currentApi == 1) {
          transcriptsFull = transcriptsFull + response
          azureHandler()
        }
      }
    );
  };

  const  checkNull = async (input: string) => {
    if (input == null || input == "" ) {
      input = "empty"
    } 
  }
  let fullTranscripts;
  if (desiredAPI == 0) {
    fullTranscripts = transcripts
  } else {
    fullTranscripts = azureTranscripts
  }
  const capts = document.getElementById('captionsSpace')
  if (capts != null) {
  var isScrolledToBottom = capts.scrollHeight - capts.clientHeight <= capts.scrollTop + 1
  capts.scrollTop = capts.scrollHeight - capts.clientHeight // scroll to bottom
  }

  if (stateRefControl.current.listening) {
    if (stateRefControl.current.showFrequency) {
      return (
        <div>
          <Draggable id="fullVisual">
            <Resizable size="290px">
              <LoungeVisual></LoungeVisual>
            </Resizable>
          </Draggable>
          <ul >
            {fullTranscripts.map(transcript => (
              <h3 id = "captionsSpace" style = {{position: 'fixed', width: '90%', textAlign: 'left', left: '0', fontSize: textSizeA, paddingLeft: '5%', paddingRight: '60%', overflowY: 'scroll', height: '40%', color: textSize.textColor}}>{transcript}</h3>
            ))}
          </ul>
        </div>
      );
    } else if (stateRefControl.current.showTimeData) {
      return (
        <div>
          <Draggable id="timeData">
            <Resizable size="290px">
              <TimeDataVisual></TimeDataVisual>
            </Resizable>
          </Draggable>
          <ul >
            {fullTranscripts.map(transcript => (
              <h3 id = "captionsSpace" style = {{position: 'fixed', width: '90%', textAlign: 'left', left: '0', fontSize: textSizeA, paddingLeft: '5%', paddingRight: '60%', overflowY: 'scroll', height: '40%', color: textSize.textColor}}>{transcript}</h3>
            ))}
          </ul>
        </div>
      );
    }

    // not showing any visualization
    return (
      <div>
        <ul >
          {fullTranscripts.map(transcript => (
            <h3 id = "captionsSpace" style = {{position: 'fixed', width: '90%', textAlign: 'left', left: '0', fontSize: textSizeA, paddingLeft: '5%', paddingRight: '60%', overflowY: 'scroll', height: '40%', color: textSize.textColor}}>{transcript}</h3>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
        <ul >
          {fullTranscripts.map(transcript => (
            <h3 id = "captionsSpace" style = {{position: 'fixed', width: '90%', textAlign: 'left', left: '0', fontSize: textSizeA, paddingLeft: '5%', paddingRight: '60%', overflowY: 'scroll', height: '40%', color: textSize.textColor}}>{transcript}</h3>
          ))}
        </ul>
    </div>
  );
};