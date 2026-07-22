import { db, Resume } from '../../db';
import { AuthService } from '../auth/auth.service';
import { getSupabaseClient } from '../../services/supabase';
import { ensureUUID } from '../interview/interview.service';

export class HistoryService {
  static async getResumes() {
    const user = AuthService.getCurrentUser();
    const userId = user?.id || 'usr-anonymous';

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .order('uploaded_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          data.forEach(r => {
            const mapped: Resume = {
              id: r.id,
              userId: r.user_id || userId,
              title: r.title || 'Untitled Resume',
              text: r.raw_text || '',
              skills: r.skills || [],
              fileType: r.file_type || 'text',
              fileName: r.file_name,
              fileSize: r.file_size,
              fileUrl: r.file_url,
              experienceYears: r.experience_years || 0,
              uploadedAt: r.uploaded_at || new Date().toISOString(),
              updatedAt: r.updated_at
            };
            db.resumes.set(r.id, mapped);
          });
        }
      } catch (e) {
        console.warn('🔮 [Supabase] Failed to fetch resumes:', e);
      }
    }

    return Array.from(db.resumes.values()).filter(r => r.userId === userId || r.userId === 'usr-anonymous');
  }

  static async deleteResume(id: string) {
    db.resumes.delete(id);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('resumes').delete().eq('id', ensureUUID(id));
      } catch (e) {
        console.warn('🔮 [Supabase] Failed to delete resume:', e);
      }
    }
    return true;
  }

  static getJobDescriptions() {
    const user = AuthService.getCurrentUser();
    const userId = user?.id || 'usr-anonymous';
    return Array.from(db.jobDescriptions.values()).filter(j => j.userId === userId || j.userId === 'usr-anonymous');
  }
}
