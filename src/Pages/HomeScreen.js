import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PrimaryAppBar from '../components/Appbar';
import SubjectInput from '../components/InputCards/subjectInput';
import SectionInput from '../components/InputCards/sectionInput';
import TeacherInput from '../components/InputCards/teacherInput';
import SubjectTable from '../components/Tables/subjectTable';
import SectionTable from '../components/Tables/sectionTable';
import TeacherTable from '../components/Tables/teacherTable';
import LectureInput from '../components/lectures/lectureInput';
import LectureTable from '../components/lectures/lectureTable';
import WorkingtimeInput from '../components/InputCards/workingtimeInput';
import WorkingtimeTable from '../components/Tables/workingtimeTable';
import { Button, CircularProgress } from '@material-ui/core';
import GenerateTimetable from '../components/GenerateTimetable';
import './HomeScreen.css';
import docs from '../constants/docs';
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
  cardHolder: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-evenly',
    marginTop: 70,
    [theme.breakpoints.up('sm')]: {
      marginTop: 80,
    },
  },
  lectures: {
    width: '100%',
    margin: '0% 5%',
  },
  genButton: {
    marginBottom: 25,
  },
  wrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonProgress: {
    position: 'absolute',
    top: '3%',
  },
  footer: {
    marginBottom: 30,
    fontSize: '1.2rem',
    letterSpacing: '0.3rem',
    textAlign: 'center',
    // textShadow: '0 0 .5rem black',
    color: 'white',
    '& a': {
      color: '#791E94',
      '&:hover': {
        fontWeight: 700,
      },
    },
  },
}));

const weekSchedule = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0 };

const HomeScreen = () => {
  const db = firebase.firestore();
  const userRef = db.collection(firebase.auth().currentUser.uid);
  const classes = useStyles();

  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [workingTime, setworkingTime] = useState(weekSchedule);
  const [loading, setloading] = useState(false);
  const [timetable, setTimetable] = useState(undefined);

  const updateDB = (sub, docType) => {
    switch (docType) {
      case 'subjects':
        setSubjects(sub);
        break;
      case 'sections':
        setSections(sub);
        break;
      case 'teachers':
        setTeachers(sub);
        break;
      case 'lectures':
        setLectures(sub);
        break;
      case 'workingTime':
        setworkingTime(sub);
        break;
      default:
        console.error('Wrong Document');
    }
    userRef
      .doc(docType)
      .set(docType === docs.workingTime ? sub : { ...Object(sub) })
      .then((e) => console.log('saved'))
      .catch((e) => console.error('error', e));
  };

  const fetchTimetable = useCallback(async () => {
    const db = firebase.firestore();
    const userRef = db.collection(firebase.auth().currentUser.uid);

    const temp = {};

    await userRef
      .doc(docs.timeTable)
      .collection(docs.timeTable)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const lecSec = [];
          snapshot.forEach((snap) => {
            temp[snap.id] = Object.values(snap.data());
            lecSec.push(snap.id);
          });
          setTimetable(temp);
        }
      });
  }, []);

  const fetchRecords = useCallback(async () => {
    const db = firebase.firestore();
    const userRef = db.collection(firebase.auth().currentUser.uid);
    userRef
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          const records =
            doc.id === docs.workingTime
              ? doc.data()
              : Object.values(doc.data());
          switch (doc.id) {
            case docs.subjects:
              setSubjects(records);
              break;
            case docs.sections:
              setSections(records);
              break;
            case docs.teachers:
              setTeachers(records);
              break;
            case docs.lectures:
              setLectures(records);
              break;
            case docs.workingTime:
              setworkingTime(records);
              break;

            default:
              console.error('Wrong Document');
          }
        });
      })
      .catch((e) => console.log('err', e));
  }, []);

  React.useEffect(() => {
    fetchRecords();
    fetchTimetable();
  }, [fetchRecords, fetchTimetable]);

  const generateButton = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID: firebase.auth().currentUser.uid }),
    };
    setloading(true);
    fetch('/generate', requestOptions)
      .then((response) => response.json())
      .then(async () => {
        fetchTimetable();
        setloading(false);
      })
      .catch((e) => {
        console.log(e);
        setloading(false);
      });
  };
  // console.log(subjects);
  // console.log(sections);
  // console.log(teachers);
  // console.log(lectures);
  // console.log(workingTime);
  // console.log(timetable);

  return (
    <div>
      <PrimaryAppBar />
      <div className={classes.cardHolder}>
        <div>
          <SubjectInput
            className={classes.card}
            subjects={subjects}
            setSubjects={updateDB}
            docs={docs}
          />
          <SubjectTable
            subjects={subjects}
            setSubjects={updateDB}
            docType={docs}
          />
        </div>
        <div>
          <SectionInput
            className={classes.card}
            sections={sections}
            setSections={updateDB}
            docs={docs}
          />
          <SectionTable
            sections={sections}
            setSections={updateDB}
            docs={docs}
          />
        </div>
        <div>
          <TeacherInput
            className={classes.card}
            teachers={teachers}
            setTeachers={updateDB}
            docs={docs}
          />
          <TeacherTable
            teachers={teachers}
            setTeachers={updateDB}
            docs={docs}
          />
        </div>

        <div className={classes.lectures}>
          <LectureInput
            lectures={lectures}
            setLectures={updateDB}
            docs={docs}
            subjects={subjects}
            sections={sections}
            teachers={teachers}
          />
          <LectureTable
            lectures={lectures}
            setLectures={updateDB}
            docs={docs}
          />
        </div>
        <div>
          <WorkingtimeInput
            workingTime={workingTime}
            setworkingTime={updateDB}
            sections={sections}
            docs={docs}
          />
          <WorkingtimeTable
            workingTime={workingTime}
            setworkingTime={updateDB}
            docs={docs}
          />
        </div>
      </div>
      <div className={classes.wrapper}>
        <Button
          variant='contained'
          color='secondary'
          size='large'
          className={classes.genButton}
          onClick={generateButton}
          disabled={!lectures.length || loading}
        >
          Generate Timetable
        </Button>
        {loading && (
          <CircularProgress
            color='secondary'
            size={38}
            className={classes.buttonProgress}
          />
        )}
      </div>
      <GenerateTimetable timetable={timetable} />
      <div className={classes.footer}>
        Made By SURANJANA BOSE

      </div>
    </div>
  );
};

export default HomeScreen;
