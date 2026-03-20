import type { LennyAudio } from '../types';

const PROXY = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lenny-audio`;

function audio(file: string, label: string): LennyAudio {
  return { url: `${PROXY}?file=${encodeURIComponent(file)}`, label };
}

export const LENNY_AUDIOS: LennyAudio[] = [
  audio('Sorry_I_can_barely_hear_ya_there_.mp3', "Sorry, I can barely hear ya there..."),
  audio('Yes_yes_yes_.mp3', "Yes, yes, yes!"),
  audio('Ah_good_yes_yes_yes_.mp3', "Ah good, yes yes yes!"),
  audio('Someone_did_call_last_week_about_the_same_thing_was_that_you.mp3', "Someone did call last week about the same thing — was that you?"),
  audio('Sorry_what_was_you_name_again.mp3', "Sorry, what was your name again?"),
  audio('Its_funny_that_you_should_call_because_my_thirdeldest_Larissa___.mp3', "It's funny you should call, because my third-eldest Larissa..."),
  audio('Im_sorry_I_couldnt_quite_catch_ya_there_what_was_that_again.mp3', "I'm sorry, I couldn't quite catch ya there — what was that again?"),
  audio('Sorry_again.mp3', "Sorry again..."),
  audio('Could_you_say_that_again_please.mp3', "Could you say that again please?"),
  audio('Sorry_which_company_did_you_say_you_were_calling_from_again.mp3', "Sorry, which company did you say you were calling from again?"),
  audio('Heres_the_thing_cause_the_last_time_someone_called_up_and_spoke_to_me____.mp3', "Here's the thing, 'cause the last time someone called up and spoke to me..."),
  audio('Since_you_put_it_that_way_you_have_been_quite_friendly_with_me_here____.mp3', "Since you put it that way, you have been quite friendly with me here..."),
  audio('Well_with_the_world_finances_they_way_they_are___.mp3', "Well, with the world finances the way they are..."),
  audio('Well_that_does_sound_good_you_have_been_very_patient_with_an_old_man_here___.mp3', "Well, that does sound good — you have been very patient with an old man here..."),
];
