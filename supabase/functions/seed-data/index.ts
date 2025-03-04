
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Sample products data
    const products = [
      {
        name: 'Premium Paper',
        description: 'High-quality premium paper for printing and writing. 500 sheets per pack.',
        price: 75000,
        category: 'Paper',
        stock: 150,
        image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cGFwZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
        views: 124,
      },
      {
        name: 'Wooden Pencil Set',
        description: 'Set of 12 premium wooden pencils with various hardness levels.',
        price: 45000,
        category: 'Stationery',
        stock: 80,
        image: 'https://images.unsplash.com/photo-1581682785342-523e3542106a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVuY2lsc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        views: 87,
      },
      {
        name: 'Desktop Organizer',
        description: 'Wooden desktop organizer with multiple compartments for your office supplies.',
        price: 120000,
        category: 'Office Supplies',
        stock: 35,
        image: 'https://images.unsplash.com/photo-1594488894087-561d6a173441?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8b2ZmaWNlJTIwb3JnYW5pemVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        views: 56,
      },
      {
        name: 'Color Laser Printing',
        description: 'Professional color laser printing service, per page.',
        price: 2500,
        category: 'Printing Services',
        stock: 1000,
        image: 'https://images.unsplash.com/photo-1555618254-fae01e9dd4e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sb3IlMjBwcmludGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        views: 210,
      },
      {
        name: 'Wireless Keyboard',
        description: 'Compact wireless keyboard with long battery life.',
        price: 350000,
        category: 'Electronics',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8a2V5Ym9hcmR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
        views: 185,
      },
      {
        name: 'Watercolor Paint Set',
        description: 'Set of 24 professional watercolor paints in a metal case.',
        price: 280000,
        category: 'Art Supplies',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1617191880520-94cf871eada8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8d2F0ZXJjb2xvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        views: 73,
      },
    ]

    // Insert products
    for (const product of products) {
      const now = new Date().toISOString()
      await supabaseAdmin.from('products').insert({
        ...product,
        created_at: now,
        updated_at: now,
      })
    }

    // Sample articles data (will be added after we have users)
    const articles = [
      {
        title: '10 Ways to Organize Your Workspace',
        content: `
        # 10 Ways to Organize Your Workspace

        A well-organized workspace can significantly boost your productivity and reduce stress. Here are 10 proven techniques to keep your office space tidy and functional:

        ## 1. Use Desktop Organizers
        Desktop organizers help separate and categorize small items like paperclips, sticky notes, and pens.

        ## 2. Cable Management Solutions
        Tame the cable jungle with cable clips, cable sleeves, or cable boxes to keep wires neat and tangle-free.

        ## 3. Document Filing System
        Implement a logical filing system with labels for important documents to minimize paper clutter.

        ## 4. Digital Organization
        Keep your computer desktop organized with folders and a consistent file naming convention.

        ## 5. Drawer Dividers
        Use drawer dividers to separate items and make them easier to find quickly.

        ## 6. Regular Cleaning Schedule
        Set aside time each week to clean and reorganize your workspace.

        ## 7. Vertical Storage Solutions
        Utilize wall space with shelves or wall-mounted organizers to free up desk space.

        ## 8. Minimize Decorations
        Keep decorative items to a minimum to reduce visual clutter.

        ## 9. Daily Reset Routine
        Take 5 minutes at the end of each day to reset your workspace for the next day.

        ## 10. One In, One Out Rule
        For every new item that comes into your workspace, remove something else to prevent accumulation.

        By implementing these strategies, you'll create a more productive and pleasant working environment.
        `,
        category: 'Office Hacks',
        image: 'https://images.unsplash.com/photo-1542330952-bffc55e812b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8b3JnYW5pemVkJTIwZGVza3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        views: 142,
      },
      {
        title: 'The Ultimate Guide to Choosing the Right Paper',
        content: `
        # The Ultimate Guide to Choosing the Right Paper

        Selecting the appropriate paper for your project is crucial for achieving professional results. This comprehensive guide will help you understand the different types of paper and their ideal uses.

        ## Understanding Paper Weight

        Paper weight is typically measured in GSM (grams per square meter). The higher the GSM, the thicker and more durable the paper.

        - **Light (60-100 GSM)**: Ideal for everyday printing, internal documents, and drafts.
        - **Medium (100-120 GSM)**: Perfect for reports, brochures, and double-sided printing.
        - **Heavy (160-200 GSM)**: Great for flyers, posters, and premium documents.
        - **Ultra-Heavy (250+ GSM)**: Best for business cards, postcards, and high-end marketing materials.

        ## Paper Types and Their Uses

        ### Bond Paper
        - Standard office paper
        - Great for everyday printing and internal documents
        - Usually 80-100 GSM

        ### Gloss-Coated Paper
        - Shiny, reflective surface
        - Excellent for vibrant color reproduction
        - Ideal for brochures, catalogs, and magazines

        ### Matte-Coated Paper
        - Non-reflective finish
        - Easier to read and write on
        - Perfect for reports, flyers, and presentations

        ### Recycled Paper
        - Eco-friendly option
        - Varying quality levels available
        - Great for environmentally conscious businesses

        ### Specialty Papers
        - Textured, watermarked, or uniquely colored
        - Used for invitations, certificates, and premium documents
        - Creates a lasting impression

        ## Considerations for Choosing Paper

        1. **Purpose**: What is the document being used for?
        2. **Durability**: How long does it need to last?
        3. **Print Method**: Are you using inkjet, laser, or professional printing?
        4. **Budget**: Higher quality papers come at a premium price.
        5. **Environmental Impact**: Consider recycled or sustainably sourced options.

        By selecting the right paper for your specific needs, you'll enhance the impact of your printed materials and ensure they serve their intended purpose effectively.
        `,
        category: 'Product Reviews',
        image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cGFwZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
        views: 98,
      },
      {
        title: 'Boost Your Productivity with These 5 Tools',
        content: `
        # Boost Your Productivity with These 5 Tools

        In today's fast-paced work environment, having the right tools can make all the difference in your productivity. Here are five essential tools that can help you work smarter, not harder.

        ## 1. Time Management Apps

        **Tool Recommendation: Toggl Track**

        Toggl Track allows you to monitor how you spend your working hours, helping you identify time sinks and optimize your schedule. Key features include:

        - One-click time tracking
        - Detailed reports and analytics
        - Project and client organization
        - Team collaboration options

        By understanding where your time goes, you can make informed decisions about how to allocate it more effectively.

        ## 2. Task Management Systems

        **Tool Recommendation: Notion**

        Notion combines notes, tasks, wikis, and databases into one flexible platform:

        - Customizable workspace
        - Multiple view options (calendar, list, kanban)
        - Easy content linking and referencing
        - Collaborative editing in real-time

        Having a central place for all your tasks and projects reduces mental overhead and ensures nothing falls through the cracks.

        ## 3. Focus Enhancement Tools

        **Tool Recommendation: Forest App**

        Forest uses the Pomodoro technique with a twist - you plant a virtual tree that grows during your focus time:

        - Visual representation of focus sessions
        - Gamification of productivity
        - Website blocker for distracting sites
        - Real trees planted for points earned

        These focused work intervals can dramatically increase your output quality and quantity.

        ## 4. Document Collaboration Solutions

        **Tool Recommendation: Google Workspace**

        Google Workspace provides seamless collaboration on documents:

        - Real-time editing and commenting
        - Automatic saving and version history
        - Cross-platform accessibility
        - Integrated with other productivity tools

        Streamlined document workflows eliminate time wasted on file transfers and version confusion.

        ## 5. Automation Platforms

        **Tool Recommendation: Zapier**

        Zapier connects your apps and automates repetitive tasks:

        - 3,000+ app integrations
        - No-code automation building
        - Conditional logic workflows
        - Scheduled tasks and alerts

        Automating routine tasks frees up your time for high-value work that requires human creativity and problem-solving.

        By implementing these tools strategically, you can create a productivity system that works for your specific needs and work style.
        `,
        category: 'Productivity',
        image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdGl2aXR5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        views: 215,
      },
    ]

    // First, create some test users to be authors
    const { data: adminUser } = await supabaseAdmin.auth.signUp({
      email: 'admin@example.com',
      password: 'password123',
      options: {
        data: {
          name: 'Admin User'
        }
      }
    })

    const { data: editorUser } = await supabaseAdmin.auth.signUp({
      email: 'editor@example.com',
      password: 'password123',
      options: {
        data: {
          name: 'Editor User'
        }
      }
    })

    // Update their roles manually
    if (adminUser?.user) {
      await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', adminUser.user.id)
    }

    if (editorUser?.user) {
      await supabaseAdmin
        .from('profiles')
        .update({ role: 'editor' })
        .eq('id', editorUser.user.id)
    }

    // Insert articles
    for (let i = 0; i < articles.length; i++) {
      const now = new Date().toISOString()
      const authorId = i % 2 === 0 ? 
        adminUser?.user?.id : 
        editorUser?.user?.id

      if (authorId) {
        await supabaseAdmin.from('articles').insert({
          ...articles[i],
          author_id: authorId,
          created_at: now,
          updated_at: now,
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sample data created successfully!',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        status: 400,
      }
    )
  }
})
