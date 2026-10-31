import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { usePetCare } from '../store/PetCareContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { durations, symptomGroups } from '../data/mockData';
import { API_URL } from '../../../config/api';
import { classifyQuestion } from '../utils/triage';
import { Card, PageHeader, Pill, formatAge } from '../components/common';
import { pc, fieldSx, primaryBtnSx } from '../petCareStyles';

const nowTime = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const newId = () => `${Date.now()}${Math.random()}`;

// Tin nhắn bot dựng sẵn (lời chào, gợi ý dự phòng) chỉ lưu mã câu trả lời + biến; nội dung được dịch lúc hiển thị.
// Tin nhắn từ AI thật lưu nguyên văn trong text.
const botMsg = (replyKey, petName = null, duration = null, note = null) => ({ id: newId(), role: 'bot', replyKey, petName, duration, note, time: nowTime() });
const aiMsg = (text, emergency) => ({ id: newId(), role: 'bot', text, emergency, time: nowTime() });
const userMsg = (text) => ({ id: newId(), role: 'user', text, time: nowTime() });

// Hiển thị markdown tối giản mà AI hay dùng: **đậm** và gạch đầu dòng "* " / "- "
const renderRichText = (text) =>
  text.split('\n').map((rawLine, i) => {
    const line = rawLine.replace(/^(\s*)[*-]\s+/, '$1• ');
    return (
      <React.Fragment key={i}>
        {i > 0 && '\n'}
        {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part)}
      </React.Fragment>
    );
  });

const ChatMessage = ({ msg }) => {
  const { t } = useLanguage();
  const isBot = msg.role === 'bot';
  const emergency = msg.emergency || msg.replyKey === 'emergency';

  let text = msg.text;
  if (isBot && msg.replyKey) {
    text = t(`petCare.chat.replies.${msg.replyKey}`, {
      pet: msg.petName || t('petCare.chat.defaultPet'),
      duration: msg.duration ? t(`petCare.chat.durations.${msg.duration}`) : '',
    });
    if (!['greeting', 'emergency'].includes(msg.replyKey)) text += `\n\n${t('petCare.chat.replies.bookingHint')}`;
    if (msg.note) text = `${t(msg.note)}\n\n${text}`;
  }

  return (
    <Box sx={{ display: 'flex', gap: 1.25, flexDirection: isBot ? 'row' : 'row-reverse', alignItems: 'flex-end', mb: 2 }}>
      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: isBot ? pc.primarySoft : pc.blueSoft, display: 'grid', placeItems: 'center', fontSize: 16, flexShrink: 0 }}>
        {isBot ? '🩺' : '🙂'}
      </Box>
      <Box sx={{ maxWidth: { xs: '85%', md: '75%' } }}>
        <Box
          sx={{
            whiteSpace: 'pre-line', fontSize: 14, lineHeight: 1.7, px: 2, py: 1.5, borderRadius: '16px',
            ...(isBot
              ? { bgcolor: emergency ? pc.redSoft : pc.primarySoft, color: emergency ? '#b42318' : pc.ink, borderBottomLeftRadius: '4px', border: emergency ? '1px solid #ffc9c4' : 'none' }
              : { bgcolor: pc.primary, color: '#fff', borderBottomRightRadius: '4px' }),
          }}
        >
          {isBot ? renderRichText(text) : text}
        </Box>
        <Typography sx={{ fontSize: 11, color: pc.faint, mt: 0.5, textAlign: isBot ? 'left' : 'right' }}>{msg.time}</Typography>
      </Box>
    </Box>
  );
};

const FieldLabel = ({ children }) => (
  <Typography sx={{ fontSize: 13, fontWeight: 700, color: pc.ink, mb: 1 }}>{children}</Typography>
);

const AiConsultationPage = () => {
  const { t, pick, lang } = useLanguage();
  const { pets, notify } = usePetCare();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => [botMsg('greeting')]);
  const [input, setInput] = useState('');
  const [petId, setPetId] = useState(pets[0]?.id || '');
  const [duration, setDuration] = useState(durations[0]);
  const [symptoms, setSymptoms] = useState([]);
  const [fileName, setFileName] = useState('');
  const bodyRef = useRef(null);

  const pet = pets.find((p) => p.id === petId);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading]);

  // Lịch sử gửi cho AI: bỏ lời chào dựng sẵn, các tin dựng sẵn khác được dịch ra chữ
  const toHistory = (list) =>
    list
      .filter((m) => m.replyKey !== 'greeting')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.replyKey
          ? t(`petCare.chat.replies.${m.replyKey}`, { pet: m.petName || t('petCare.chat.defaultPet'), duration: '' })
          : m.text,
      }));

  const send = async (text) => {
    const question = text.trim();
    if (!question || loading) return;
    const questionMsg = userMsg(question);
    const history = [...toHistory(messages), { role: 'user', content: question }];
    setMessages((m) => [...m, questionMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/vetai.ctr/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          messages: history,
          duration: t(`petCare.chat.durations.${duration}`),
          symptoms: symptoms.map((s) => t(`petCare.chat.symptoms.${s}`)),
          pet: pet && {
            name: pet.name,
            species: t(`petCare.species.${pet.species}`),
            breed: pick(pet.breed),
            sex: t(`petCare.sex.${pet.sex}`),
            age: formatAge(pet.age, t),
            weight: pet.weight,
          },
        }),
      });
      const result = await res.json().catch(() => null);
      if (res.ok && result?.data?.reply) {
        setMessages((m) => [...m, aiMsg(result.data.reply, result.data.emergency)]);
      } else if (res.status === 429) {
        setMessages((m) => [...m, aiMsg(t('petCare.chat.rateLimited'), false)]);
      } else {
        throw new Error(result?.message || `HTTP ${res.status}`);
      }
    } catch (err) {
      // Backend/AI không khả dụng: quay về gợi ý dựng sẵn theo từ khóa
      console.warn('Vet AI unavailable, using local fallback:', err);
      setMessages((m) => [...m, botMsg(classifyQuestion(question), pet?.name, duration, 'petCare.chat.offline')]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (s) =>
    setSymptoms((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]));

  const sendSymptomForm = () => {
    send(t('petCare.chat.formMessage', {
      pet: pet?.name || t('petCare.chat.defaultPet'),
      duration: t(`petCare.chat.durations.${duration}`),
      symptoms: symptoms.map((s) => t(`petCare.chat.symptoms.${s}`)).join(', ') || t('petCare.chat.noneSelected'),
    }));
  };

  const resetChat = () => {
    setMessages([botMsg('greeting')]);
    setSymptoms([]);
    setFileName('');
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : '');
    if (file) notify(t('petCare.chat.mediaToast'), 'info');
  };

  return (
    <Box>
      <PageHeader
        crumb={t('petCare.chat.crumb')}
        eyebrow={t('petCare.chat.eyebrow')}
        title={t('petCare.chat.title')}
        subtitle={t('petCare.chat.subtitle')}
        action={<Pill tone="green">{t('petCare.chat.ready')}</Pill>}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.65fr) minmax(300px, 1fr)' }, gap: 2.5, alignItems: 'start' }}>
        {/* Khung chat */}
        <Card sx={{ display: 'flex', flexDirection: 'column', height: { xs: 560, md: 620 }, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2, borderBottom: `1px solid ${pc.border}` }}>
            <Box sx={{ width: 42, height: 42, borderRadius: '12px', bgcolor: pc.primarySoft, color: pc.primary, display: 'grid', placeItems: 'center' }}>
              <AutoAwesomeOutlinedIcon />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, color: pc.ink }}>PetCare AI <Box component="span" sx={{ color: pc.primary }}>✦</Box></Typography>
              <Typography sx={{ fontSize: 11, color: pc.faint, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: pc.green }} /> {t('petCare.chat.botSubtitle')}
              </Typography>
            </Box>
            <IconButton onClick={resetChat} aria-label={t('petCare.chat.reset')} title={t('petCare.chat.reset')} sx={{ border: `1px solid ${pc.border}`, borderRadius: '10px' }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box ref={bodyRef} sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 2.5 }, pt: 2.5 }}>
            {messages.map((m) => <ChatMessage key={m.id} msg={m} />)}
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2, color: pc.faint, fontSize: 13 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: pc.primarySoft, display: 'grid', placeItems: 'center', fontSize: 16 }}>🩺</Box>
                <CircularProgress size={14} sx={{ color: pc.primary }} />
                {t('petCare.chat.thinking')}
              </Box>
            )}
          </Box>

          {messages.length === 1 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, px: 2.5, pb: 1.5 }}>
              {t('petCare.chat.suggestions').map((s) => (
                <Box
                  key={s.label} component="button" onClick={() => send(s.text)}
                  sx={{ border: `1px solid ${pc.primaryBorder}`, bgcolor: '#fff', color: pc.primary, borderRadius: '999px', px: 1.5, py: 0.75, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', '&:hover': { bgcolor: pc.primarySoft } }}
                >
                  {s.label}
                </Box>
              ))}
            </Box>
          )}

          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            sx={{ display: 'flex', gap: 1.5, px: 2.5, pt: 1.5, borderTop: `1px solid ${pc.border}` }}
          >
            <TextField
              fullWidth size="small" placeholder={t('petCare.chat.placeholder')} value={input}
              onChange={(e) => setInput(e.target.value)} sx={fieldSx}
            />
            <IconButton type="submit" disabled={loading} aria-label={t('petCare.chat.send')} sx={{ bgcolor: pc.primary, color: '#fff', borderRadius: '12px', width: 44, height: 40, '&:hover': { bgcolor: pc.primaryDark }, '&.Mui-disabled': { bgcolor: pc.primaryBorder, color: '#fff' } }}>
              <SendRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography sx={{ fontSize: 11, color: pc.faint, textAlign: 'center', py: 1.25 }}>
            {t('petCare.chat.disclaimer')}
          </Typography>
        </Card>

        {/* Form thông tin bổ sung */}
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontWeight: 800, color: pc.ink, fontSize: 16, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AssignmentOutlinedIcon sx={{ color: pc.primary }} fontSize="small" /> {t('petCare.chat.formTitle')}
            </Typography>

            <FieldLabel>{t('petCare.chat.petLabel')}</FieldLabel>
            <TextField select fullWidth size="small" value={petId} onChange={(e) => setPetId(e.target.value)} sx={{ ...fieldSx, mb: 2 }}>
              {pets.map((p) => <MenuItem key={p.id} value={p.id}>{p.name} · {t(`petCare.species.${p.species}`)}</MenuItem>)}
            </TextField>

            <FieldLabel>{t('petCare.chat.durationLabel')}</FieldLabel>
            <TextField select fullWidth size="small" value={duration} onChange={(e) => setDuration(e.target.value)} sx={{ ...fieldSx, mb: 2 }}>
              {durations.map((d) => <MenuItem key={d} value={d}>{t(`petCare.chat.durations.${d}`)}</MenuItem>)}
            </TextField>

            <FieldLabel>{t('petCare.chat.symptomsLabel')}</FieldLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {symptomGroups.map((s) => {
                const selected = symptoms.includes(s);
                return (
                  <Box
                    key={s} component="button" type="button" onClick={() => toggleSymptom(s)} aria-pressed={selected}
                    sx={{
                      border: `1px solid ${selected ? pc.primary : pc.border}`, bgcolor: selected ? pc.primarySoft : '#fff', fontFamily: 'inherit',
                      color: selected ? pc.primary : pc.muted, borderRadius: '10px', px: 1.5, py: 0.75, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {t(`petCare.chat.symptoms.${s}`)}
                  </Box>
                );
              })}
            </Box>

            <FieldLabel>{t('petCare.chat.mediaLabel')}</FieldLabel>
            <Box
              component="label"
              sx={{
                display: 'block', textAlign: 'center', border: `1.5px dashed ${pc.primaryBorder}`, borderRadius: '14px', p: 2, cursor: 'pointer', mb: 2,
                '&:hover': { bgcolor: pc.primarySoft },
              }}
            >
              <input type="file" accept="image/*,video/*" hidden onChange={onFileChange} />
              <FileUploadOutlinedIcon sx={{ color: pc.primary }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: pc.ink }}>
                {fileName ? t('petCare.chat.mediaChosen', { name: fileName }) : t('petCare.chat.mediaChoose')}
              </Typography>
              <Typography sx={{ fontSize: 11, color: pc.faint }}>{t('petCare.chat.mediaHint')}</Typography>
            </Box>

            <Button fullWidth disabled={loading} startIcon={<ChatBubbleOutlineIcon />} sx={{ ...primaryBtnSx, py: 1.4 }} onClick={sendSymptomForm}>
              {t('petCare.chat.sendForm')}
            </Button>
          </Card>

          <Box sx={{ p: 2, borderRadius: '16px', bgcolor: pc.redSoft, border: '1px solid #ffd0cc' }}>
            <Typography sx={{ fontWeight: 800, color: '#b42318', fontSize: 13 }}>{t('petCare.chat.emergencyTitle')}</Typography>
            <Typography sx={{ color: '#c2413c', fontSize: 12, mt: 0.5, lineHeight: 1.7 }}>
              {t('petCare.chat.emergencyText')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AiConsultationPage;
