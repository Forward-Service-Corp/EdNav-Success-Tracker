import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useClients } from '@/contexts/ClientsContext';
import CommentForm from './CommentForm';
import NoteModal from '../components/NoteModal';
import ActivityModal from '@/components/ActivityModal';
import CommentDebugger from './CommentDebugger'; // Optional debug component